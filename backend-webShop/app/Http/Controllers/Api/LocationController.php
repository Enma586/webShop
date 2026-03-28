<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Municipality;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getDepartments()
    {
        $departments = Department::orderBy('name', 'asc')->get();
        return response()->json($departments);
    }

    public function getMunicipalities($departmentId)
    {
        $municipalities = Municipality::where('department_id', $departmentId)
            ->orderBy('name', 'asc')
            ->get();
            
        return response()->json($municipalities);
    }
}