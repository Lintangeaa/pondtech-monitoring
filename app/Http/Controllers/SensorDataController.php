<?php

namespace App\Http\Controllers;

use App\Models\SensorData;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class SensorDataController extends Controller
{
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'temperature' => 'required|numeric',
                'ph' => 'required|numeric',
                'salinity' => 'required|numeric',
            ]);

            SensorData::create($data);

            return response()->json(['message' => 'Data stored successfully'], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while storing data',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function index()
    {
        $data = SensorData::all();
        return response()->json($data);
    }

    public function getData()
    {
        $datas = SensorData::latest()->take(100)->get();
        $data = SensorData::latest()->first();
        return response()->json([
            'sensorDatas' => $datas,
            'sensorData' => $data
        ]);
    }
}
