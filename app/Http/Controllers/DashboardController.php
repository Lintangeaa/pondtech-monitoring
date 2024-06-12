<?php

namespace App\Http\Controllers;

use App\Models\SensorData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{

    public function index()
    {
        $datas = SensorData::latest()->take(100)->get();
        $data = SensorData::latest()->first();
        return Inertia::render('Monitoring/Index', [
            'sensorDatas' => $datas,
            'sensorData' => $data
        ]);


    }


}
