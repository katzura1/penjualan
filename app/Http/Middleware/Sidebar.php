<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Menu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\Response;

class Sidebar
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        if (Schema::hasTable('menus') && $user) {
            $slug = $request->path();
            //check access
            $menu = Menu::join(
                'menu_user_levels',
                'menu_user_levels.id_menu',
                '=',
                'menus.id'
            )
                ->where('slug', $slug)
                ->pluck('level')
                ->toArray();

            if (count($menu) > 0 && !in_array($user->level, $menu)) {
                abort(403, 'Anda tidak memilik akses kehalaman ini.');
            }

            $sidebars = Menu::getByLevel($user->level);

            // dd($sidebars);

            View::share('sidebars', $sidebars ?? []);
        }
        return $next($request);
    }
}
