<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    public function getLocations(): JsonResponse
    {
        $locations = Department::with('municipalities')->get();
        return response()->json($locations);
    }
}