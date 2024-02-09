<?php

namespace App\Models\Master;

use App\Models\Inventory;
use App\Models\Master\ProductCategory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'barcode',
        'name',
        'product_category_id',
        'user_id',
    ];

    public function productCategory()
    {
        return $this->belongsTo(ProductCategory::class, 'product_category_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function inventory()
    {
        return $this->hasOne(Inventory::class, 'product_id', 'id');
    }
}
