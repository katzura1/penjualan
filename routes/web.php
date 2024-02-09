<?php

use App\Models\Returns;
use Illuminate\Http\Request;
use App\Models\SupplierInvoice;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\Master\MenuController;
use App\Http\Controllers\Master\UserController;
use App\Http\Controllers\ResiProductController;
use App\Http\Controllers\Master\BrandController;
use App\Http\Controllers\Master\OutletController;
use App\Http\Controllers\Master\ProductController;
use App\Http\Controllers\Purchase\StockController;
use App\Http\Controllers\Master\SupplierController;
use App\Http\Controllers\Purchase\FormulaController;
use App\Http\Controllers\Master\ProductCategoryController;
use App\Http\Controllers\Master\ProductPurchaseController;
use App\Http\Controllers\Master\ProductTransferController;
use App\Http\Controllers\ResiMasterController;
use App\Http\Controllers\Transfer\StockController as TransferStockController;
use App\Http\Controllers\Transfer\FormulaController as TransferFormulaController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::redirect('/', '/login', 301);
Route::get('logout', [LoginController::class, 'logout'])->name('logout');

Route::middleware(['auth', 'sidebar'])->group(function () {
    Route::get('home', function (Request $request) {
        return view('pages.home');
    })->name('home');
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
 */

Route::middleware(['guest'])->group(function () {
    Route::get('login', [LoginController::class, 'login'])->name('login');
    Route::post('login/authenticate', [LoginController::class, 'authenticate'])->name('login.authenticate');
});


/*
|--------------------------------------------------------------------------
| User Routes
|--------------------------------------------------------------------------
 */
Route::middleware(['auth', 'sidebar'])->prefix('user')->group(function () {
    Route::get('/', [UserController::class, 'index'])->name('user.index');
    Route::get('data', [UserController::class, 'data'])->name('user.data');

    Route::post('store', [UserController::class, 'store'])->name('user.store');
    Route::post('update', [UserController::class, 'update'])->name('user.update');
});

/*
|--------------------------------------------------------------------------
| Menu Routes
|--------------------------------------------------------------------------
 */
Route::middleware(['auth', 'sidebar'])->prefix('menu')->group(function () {
    Route::get('/', [MenuController::class, 'index'])->name('menu.index');
    Route::get('data', [MenuController::class, 'data'])->name('menu.data');

    Route::post('store', [MenuController::class, 'store'])->name('menu.store');
    Route::post('update', [MenuController::class, 'update'])->name('menu.update');
    Route::post('destroy', [MenuController::class, 'destroy'])->name('menu.destroy');

    Route::post('store-user', [MenuController::class, 'storeUser'])->name('menu.store-user');
});
