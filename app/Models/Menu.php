<?php

namespace App\Models;

use App\Models\MenuUserLevel;
use Illuminate\Support\Facades\Cache;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Menu extends Model
{
    protected $fillable = ['name', 'id_parent', 'slug', 'type', 'order'];

    public function parent()
    {
        return $this->belongsTo($this, 'id_parent');
    }

    public function children()
    {
        return $this->hasMany($this, 'id_parent');
    }

    public function level()
    {
        return $this->hasMany(MenuUserLevel::class, 'id_menu', 'id');
    }

    protected static function queryGetMenuByLevel($level)
    {
        return Menu::select('menus.*')
            ->with(['children' => function ($query) use ($level) {
                $query->join('menu_user_levels', 'menu_user_levels.id_menu', '=', 'menus.id');
                $query->where('menu_user_levels.level', '=', $level);
                $query->orderBy('order');
            }])
            ->join(
                'menu_user_levels',
                'menu_user_levels.id_menu',
                '=',
                'menus.id'
            )
            ->where('type', 'parent')
            ->where(
                'menu_user_levels.level',
                '=',
                $level
            )
            ->orderBy('order')
            ->get()
            ->toArray();
    }

    public static function getByLevel($level)
    {
        return Cache::remember('users_' . $level, 60 * 60 * 24, function () use ($level) {
            return Menu::queryGetMenuByLevel($level);
        });
    }

    public static function updateMenuByLevel($level)
    {
        $menu = Menu::queryGetMenuByLevel($level);
        Cache::put('users_' . $level, $menu);
    }
}
