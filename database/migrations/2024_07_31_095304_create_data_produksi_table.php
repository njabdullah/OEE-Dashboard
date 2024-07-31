<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDataProduksiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data_produksi', function (Blueprint $table) {
            $table->string('line_produksi', 10);
            $table->string('nama_line', 50);
            $table->date('tgl_produksi');
            $table->integer('shift_produksi');
            $table->string('tipe_barang', 10);
            $table->timestamp('timestamp_capture');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data_produksi');
    }
}