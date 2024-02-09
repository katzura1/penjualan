<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Rawilk\Settings\Facades\Settings;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function index()
    {
        return view('pages.setting', [
            'passwordAdmin' => Settings::get('passwordAdmin'),
        ]);
    }

    public function settingPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return $this->error(500, implode('<br>', $validator->errors()->all()));
        }

        try {
            Settings::set('passwordAdmin', $request->password);

            return $this->success('Password berhasil diubah');
        } catch (\Throwable $th) {
            return $this->error(500, $th->getMessage());
        }
    }
}
