<?php

namespace App\Http\Controllers\Master;

use Exception;
use App\Models\Menu;
use Illuminate\Http\Request;
use App\Models\MenuUserLevel;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    public function index()
    {
        $parents = Menu::select(
            'id',
            'name'
        )
            ->where('type', 'parent')
            ->orderBy('menus.name')
            ->get();

        $userLevels = [
            [
                'key' => 'Admin',
                'value' => 'admin',
            ],
            [
                'key' => 'Packing',
                'value' => 'packing',
            ]
        ];
        return view('pages.master.menu')
            ->with(
                ['parents' => $parents, 'userLevels' => $userLevels]
            );
    }

    public function data(Request $request)
    {
        $where = [];
        if ($request->search && array_key_exists('value', $request->search)) {
            $search = $request->search['value'];
            //search param
            $where[] = ['menus.name', 'LIKE', '%' . $search . '%'];
        }
        if ($request->type) {
            $where[] = ['menus.type', '=', $request->type];
            if ($request->type == 'child' && $request->id_parent) {
                $where[] = ['menus.id_parent', '=', $request->id_parent];
            }
        }
        //get request page
        $request['page'] = $request->start == 0 ? 1 : round(($request->start + $request->length) / $request->length);
        //get data
        $datas = Menu::select(
            'menus.id',
            'menus.name',
            'menus.slug',
            'menus.type',
            'menus.id_parent',
            'menus.order'
        )
            ->with('parent')
            ->with('level:id_menu,level')
            ->where($where)
            ->paginate($request->length ?? 10)
            ->toArray();

        $final['draw'] = $request['draw'];
        $final['recordsTotal'] = $datas['total'];
        $final['recordsFiltered'] = $datas['total'];
        $final['data'] = $datas['data'];

        return response()->json($final, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:menus',
            'slug' => 'required|string|max:100',
            'type' => 'required|in:parent,child',
            'order' => 'required|numeric',
        ]);

        $validator->sometimes('id_parent', 'required|integer|min:0', function ($input) {
            return $input->type == 'child';
        });


        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        try {
            DB::beginTransaction();
            $menu = Menu::create($validated);
            DB::commit();
            return $this->success('Data berhasil disimpan', $menu);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:menus,id',
            'name' => 'required|unique:menus,name,' . $request->id,
            'slug' => 'required|string|max:100',
            'type' => 'required|in:parent,child',
            'order' => 'required|numeric',
        ]);

        $validator->sometimes('id_parent', 'required|integer|min:0', function ($input) {
            return $input->type == 'child';
        });

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        // Retrieve the validated input...
        $validated = $validator->safe()->except(['id']);
        $validated['type'] == 'parent' && $validated['id_parent'] = null;
        try {
            DB::beginTransaction();
            $menu = Menu::where('id', $validator->safe()->only(['id']))->update($validated);
            if ($menu) {
                DB::commit();
                return $this->success('Data berhasil disimpan', $menu);
            }
            DB::rollBack();
            return $this->error(404, 'Data tidak ditemukan.');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:menus,id',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        try {
            DB::beginTransaction();
            MenuUserLevel::where('id_menu', $request->id)->delete();
            Menu::where('id', $request->id)->delete();
            DB::commit();
            return $this->success('Berhasil menghapus data.');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage());
        }
    }

    public function dataUser(Request $request)
    {
        $where = [];
        //search param
        $search = $request->search['value'];
        $where[] = ['user_levels.name', 'LIKE', '%' . $search . '%'];
        //get request page
        $request['page'] = $request->start == 0 ? 1 : round(($request->start + $request->length) / $request->length);

        $MenuUserLevels = MenuUserLevel::select(
            'menu_user_levels.id_menu',
            'menu_user_levels.level',
        );
        if ($request->id_menu) {
            $where[] = ['menu_user_levels.id_menu', '=', $request->id_menu];
        }
        //get data
        $datas = $MenuUserLevels->where($where)->paginate($request->length ?? 10)->toArray();
        $final['draw'] = $request['draw'];
        $final['recordsTotal'] = $datas['total'];
        $final['recordsFiltered'] = $datas['total'];
        $final['data'] = $datas['data'];
        return response()->json($final, 200);
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_menu' => 'required|numeric|exists:menus,id',
            'user_level' => 'required|array|min:0',
            'user_level.*' => 'required|string|in:admin,user',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            MenuUserLevel::where('id_menu', $validated['id_menu'])->delete();
            foreach ($validated['user_level'] as $key => $value) {
                MenuUserLevel::create([
                    'id_menu' => $validated['id_menu'],
                    'level' => $value,
                ]);
                Menu::updateMenuByLevel($value);
            }
            DB::commit();
            return $this->success('Data berhasil disimpan');
        } catch (Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }
}
