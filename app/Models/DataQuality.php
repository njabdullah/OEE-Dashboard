<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataQuality extends Model
{
    use HasFactory;

    protected $table = 'data_qualityloss';

    protected $fillable = [
        'line',
        'shift',
        'tipe_barang',
        'ratio'
    ];
}
?>