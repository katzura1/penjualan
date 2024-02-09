<?php

namespace App\Http\Controllers\Master;

use App\Models\Menu;
use App\Models\Inventory;
use Illuminate\Http\Request;
use App\Models\MenuUserLevel;
use App\Models\Master\Product;
use App\Models\Resi\ResiProduct;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Resi\ResiMasterDetail;
use App\Models\Master\ProductCategory;
use Illuminate\Support\Facades\Validator;

class ProductCategoryController extends Controller
{
    public function index(Request $request)
    {
        return view('pages.master.product_category');
    }

    public function data(Request $request)
    {
        //get data
        $data = ProductCategory::select(
            'product_categories.id',
            'product_categories.name',
            'product_categories.user_id',
            'users.name as user_name',
        )
            ->join('users', 'users.id', '=', 'product_categories.user_id')
            ->get()
            ->toArray();

        $final['draw'] = 1;
        $final['recordsTotal'] =  count($data);
        $final['recordsFiltered'] = count($data);
        $final['data'] = $data;

        return response()->json($final, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:product_categories,name',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        $validated['user_id'] = auth()->user()->id;
        try {
            DB::beginTransaction();
            $productCategory = ProductCategory::create($validated);
            DB::commit();
            return $this->success('Data berhasil disimpan', $productCategory);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:product_categories,id',
            'name' => 'required|unique:product_categories,name,' . $request->id,
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        // Retrieve the validated input...
        $validated = $validator->safe()->except(['id']);
        $validated['user_id'] = auth()->user()->id;
        try {
            DB::beginTransaction();
            $menu = ProductCategory::where('id', $request->id)->update($validated);
            DB::commit();
            return $this->success('Data berhasil disimpan', $menu);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:product_categories,id',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        try {
            DB::beginTransaction();
            $products = Product::where('product_category_id', $request->id)->get();

            foreach ($products as $product) {
                Inventory::where('product_id', $product->id)->delete();
                //delete resi product and history
                ResiProduct::where('product_id', $product->id)->delete();
                ResiMasterDetail::where('product_id', $product->id)->delete();
                $product->delete();
            }

            ProductCategory::where('id', $request->id)->delete();
            DB::commit();
            return $this->success('Berhasil menghapus data.');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage());
        }
    }
}
