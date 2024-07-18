<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DataHeader;
use App\Models\DataLinestop;
use App\Models\DataProduksi;

class DashboardController extends Controller
{
    public function show()
    {
        return view('dashboard');
    }

    public function getDataHeader()
    {
        $data_header = DataHeader::first();
        return response()->json($data_header);
    }

    public function getLinestop()
    {
        $data_linestop = DataLinestop::all();
        return response()->json($data_linestop);
    }

    public function getProduksi()
    {
        $data_produksi = DataProduksi::all();
        return response()->json($data_produksi);
    }
}