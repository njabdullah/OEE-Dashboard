<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataLinestopTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_linestop', function (Blueprint $table) {
            $table->char('downtimeid', 2);
            $table->string('downtimedesc', 100);
            $table->time('mulai');
            $table->time('selesai');
            $table->integer('duration');
            $table->string('docnumber', 50);
            $table->string('mtcnumber', 50);
            $table->text('partremark')->nullable();
            $table->text('remarks')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_linestop');
    }
}