<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMenuUserLevelsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menu_user_levels', function (Blueprint $table) {
            $table->unsignedBigInteger('id_menu');
            $table->enum('level', ['admin', 'user']);
            $table->timestamps();
            $table->primary(['id_menu', 'level']);
        });

        Schema::table('menu_user_levels', function (Blueprint $table) {
            $table->foreign('id_menu')->references('id')->on('menus');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('menu_user_levels', function (Blueprint $table) {
            $table->dropColumn('id_menu');
            $table->dropColumn('id_user_level');
        });

        Schema::dropIfExists('menu_user_levels');
    }
}
