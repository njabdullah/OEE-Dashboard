<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataLinestop extends Model
{
    use HasFactory;

    protected $table = 'data_linestop';

    protected $fillable = [
        'downtimeid',
        'downtimedesc',
        'mulai',
        'selesai',
        'duration',
        'docnumber',
        'mtcnumber',
        'partremark',
        'remarks'
    ];
}
