<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DataHeader extends Model
{
    use HasFactory;

    protected $table = 'data_header';

    protected $fillable = [
        'line',
        'linedesc',
        'tanggal',
        'shift',
        'start_prod',
        'finish_prod',
        'worktime'
    ];
}