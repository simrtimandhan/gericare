<?php

namespace App\Http\Controllers;

use App\Models\Services;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Create a new service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createService(Request $request)
    {
        $request->validate([
            'service_type' => 'required|string|max:255',
            'service_name' => 'required|string|max:255',
        ]);

        $service = Services::create([
            'service_type' => $request->service_type,
            'service_name' => $request->service_name,
        ]);

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service
        ], 201);
    }

    /**
     * Get all services.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAllServices()
    {
        $services = Services::all();

        return response()->json($services);
    }
}
