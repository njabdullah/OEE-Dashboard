<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataHeaderTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_header', function (Blueprint $table) {
            $table->string('line', 10);
            $table->string('linedesc', 100);
            $table->date('tanggal');
            $table->integer('shift');
            $table->time('start_prod');
            $table->time('finish_prod');
            $table->integer('worktime');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_header');
    }
}