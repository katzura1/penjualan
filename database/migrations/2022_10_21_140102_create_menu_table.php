<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->unsignedBigInteger('id_parent')->nullable();
            $table->string('slug');
            $table->enum('type', ['parent', 'child']);
            $table->tinyInteger('order');
            $table->timestamps();
        });

        Schema::table('menus', function (Blueprint $table) {
            $table->foreign('id_parent')->references('id')->on('menus');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('menus', function (Blueprint $table) {
            $table->dropForeign(['id_parent']);
        });
        Schema::dropIfExists('Menus');
    }
}
