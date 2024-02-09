<?php

namespace App\Http\Controllers\Master;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $userLevels = config('app.user_level');
        $with = [
            'userLevels' => $userLevels,
        ];
        return view('pages.master.user')->with($with);
    }

    public function data(Request $request)
    {
        $where = [];
        if ($request->search) {
            $search = $request->search['value'];
            //search param
            $where[] = ['users.name', 'LIKE', '%' . $search . '%'];
        }
        //get request page
        $request['page'] = $request->start == 0 ? 1 : round(($request->start + $request->length) / $request->length);
        //get data
        $datas = User::select(
            'users.id',
            'users.name',
            'users.username',
            'users.level',
            'users.status'
        )
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
        $input = $request->all();
        $input['username'] = str_replace(' ', '', $input['username']);

        $validator = Validator::make($input, [
            'name' => 'required|max:150',
            'username' => 'required|unique:users',
            'level' => 'required|string|in:' . config('app.user_level_string'),
            'password' => 'required|min:8',
            'status' => 'required|in:active,non_active'
        ]);


        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }
        // Retrieve the validated input...
        $validated = $validator->validated();
        $validated['password'] = Hash::make($validated['password']);

        try {
            DB::beginTransaction();
            $user = User::create($validated);
            DB::commit();
            return $this->success('Data berhasil disimpan', $user);
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function update(Request $request)
    {
        $input = $request->all();
        $input['username'] = str_replace(' ', '', $input['username']);

        $validator = Validator::make($input, [
            'id' => 'required|numeric|exists:users,id',
            'name' => 'required|max:150',
            'username' => 'required|unique:users,username,' . $request->id,
            'level' => 'required|string|in:' . config('app.user_level_string'),
            'password' => 'sometimes|min:8',
            'status' => 'required|in:active,non_active'
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        // Retrieve the validated input...
        $validated = $validator->safe()->except(['id']);
        if (array_key_exists('password', $validated)) {
            $validated['password'] = Hash::make($validated['password']);
        }
        try {
            DB::beginTransaction();
            $user = User::where('id', $validator->safe()->only(['id']))->update($validated);
            if ($user) {
                DB::commit();
                return $this->success('Data berhasil disimpan', $user);
            }
            DB::rollBack();
            return $this->error(404, 'Data user tidak ditemukan');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }

    public function updatePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|numeric|exists:users,id',
            'password' => 'sometimes|min:8',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()), $request->all());
        }
        // Retrieve the validated input...
        $validated = $validator->safe()->except(['id']);
        $validated['password'] = Hash::make($validated['password']);
        try {
            DB::beginTransaction();
            $user = User::where('id', $request->id)->update($validated);
            if ($user) {
                DB::commit();
                return $this->success('Data berhasil disimpan', $user);
            }
            DB::rollBack();
            return $this->error(404, 'Data user tidak ditemukan');
        } catch (\Exception $e) {
            DB::rollback();
            return $this->error(500, $e->getMessage(), $validated);
        }
    }
}
