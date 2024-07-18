<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataProduksi extends Model
{
    use HasFactory;

    protected $table = 'data_produksi';

    protected $fillable = [
        'line_produksi',
        'nama_line',
        'tgl_produksi',
        'shift_produksi',
        'tipe_barang',
        'timestamp_capture'
    ];
}