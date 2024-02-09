<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Models\Master\Product;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\Inventory;
use App\Models\InventoryHistory;
use Rap2hpoutre\FastExcel\FastExcel;
use App\Models\Master\ProductCategory;
use App\Models\Resi\ResiMasterDetail;
use App\Models\Resi\ResiProduct;
use App\Models\Resi\ResiProductHistory;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $productCategory = ProductCategory::all();
        return view('pages.master.product', compact('productCategory'));
    }

    public function data(Request $request)
    {
        $data = Product::select([
            'id',
            'barcode',
            'name',
            'product_category_id',
            'user_id',
        ])
            ->with('productCategory:id,name')
            ->get()
            ->toArray();

        $final['draw'] = 1;
        $final['recordsTotal'] =  count($data);
        $final['recordsFiltered'] = count($data);
        $final['data'] = $data;

        return response()->json($final, 200);
    }

    public function detail(Request $request)
    {
        $where = [];
        if ($request->barcode) {
            $where[] = ['barcode', '=', $request->barcode];
        }

        if ($request->name) {
            $where[] = ['name', 'like', '%' . $request->name . '%'];
        }

        if ($request->product_category_id) {
            $where[] = ['product_category_id', '=', $request->product_category_id];
        }

        $data = Product::select([
            'id',
            'barcode',
            'name',
            'product_category_id',
            'user_id',
        ])
            ->with('productCategory:id,name')
            ->where($where)
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
            'barcode' => ['required', 'string', 'max:150', 'unique:products,barcode'],
            'name' => ['required', 'string', 'max:150'],
            'product_category_id' => ['required', 'numeric', 'exists:product_categories,id'],
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        $validated['user_id'] = auth()->user()->id;
        try {
            DB::beginTransaction();
            $product = Product::create($validated);
            Inventory::create([
                'product_id' => $product->id,
                'qty' => 0,
            ]);
            DB::commit();
            return $this->success('Data berhasil disimpan', $product);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => ['required', 'numeric', 'exists:products,id'],
            'barcode' => ['required', 'string', 'max:150', 'unique:products,barcode'],
            'name' => ['required', 'string', 'max:150'],
            'product_category_id' => ['required', 'numeric', 'exists:product_categories,id'],
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        $validated['user_id'] = auth()->user()->id;
        try {
            DB::beginTransaction();
            $product = Product::find($validated['id']);
            $product->update($validated);
            DB::commit();
            return $this->success('Data berhasil disimpan', $product);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => ['required', 'numeric', 'exists:products,id'],
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        try {
            DB::beginTransaction();
            $product = Product::find($validated['id']);
            $inventory = Inventory::where('product_id', $validated['id'])->first();
            InventoryHistory::where('inventory_id', $inventory->id)->delete();
            Inventory::where('product_id', $validated['id'])->delete();
            //delete resi product and history
            ResiProduct::where('product_id', $validated['id'])->delete();
            ResiMasterDetail::where('product_id', $validated['id'])->delete();
            $product->delete();
            DB::commit();
            return $this->success('Data berhasil dihapus', $product);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function import(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => ['required', 'file', 'mimes:xlsx,xls', 'max:5120'],
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        try {
            DB::beginTransaction();
            $file = $request->file('file');
            $collection = (new FastExcel)->import($file);
            foreach ($collection as $key => $item) {
                $product = Product::where('barcode', $item['barcode'])->first();
                $productCategory = ProductCategory::where('name', $item['kategori'])->first();
                if (!$productCategory) {
                    throw new \Exception('Kategori produk `' . $item['kategori'] . '` tidak ditemukan');
                }
                if (!$product) {
                    $product = Product::create([
                        'barcode' => $item['barcode'],
                        'name' => $item['nama'],
                        'product_category_id' => $productCategory->id,
                        'user_id' => auth()->user()->id,
                    ]);

                    Inventory::create([
                        'product_id' => $product->id,
                        'qty' => 0,
                    ]);
                } else {
                    $product->update([
                        'name' => $item['nama'],
                        'product_category_id' => $productCategory->id,
                        'user_id' => auth()->user()->id,
                    ]);
                }
            }

            DB::commit();
            return $this->success('Data berhasil diimport');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }
}
