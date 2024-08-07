<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataHeader;
use App\Models\DataLinestop;
use App\Models\DataProduksi;
use App\Models\DataStandard;
use App\Models\DataQuality;

class DashboardController extends Controller
{
    public function show()
    {
        return view('dashboard');
    }

    public function getDataHeader()
    {
        $data_header = DataHeader::all();
        return response()->json($data_header);
    }

    public function getLinestop()
    {
        $data_linestop = DataLinestop::all();
        return response()->json($data_linestop);
    }

    public function getProduksi()
    {
        $data_produksi = DataProduksi::join('data_standard', function($join) {
                $join->on('data_produksi.line_produksi', '=', 'data_standard.line')
                     ->on('data_produksi.tipe_barang', '=', 'data_standard.tipe_barang');
            })
            ->join('data_qualityloss', function($join) {
                $join->on('data_produksi.line_produksi', '=', 'data_qualityloss.line')
                     ->on('data_produksi.shift_produksi', '=', 'data_qualityloss.shift')
                     ->on('data_produksi.tipe_barang', '=', 'data_qualityloss.tipe_barang');
            })
            ->select('data_produksi.*', 'data_standard.standard_cycle', 'data_qualityloss.ratio')
            ->get();
    
        return response()->json($data_produksi);
    }    
}