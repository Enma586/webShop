<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Exception;

class CustomerController extends Controller
{
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            $validator = Validator::make($request->all(), [
                'name'     => 'sometimes|string|max:100',
                'username' => 'sometimes|string|unique:users,username,' . $user->id,
                'email'    => 'sometimes|email|unique:users,email,' . $user->id,
                'password' => 'sometimes|nullable|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'fail', 'errors' => $validator->errors()], 422);
            }

            $data = $request->only(['name', 'username', 'email']);

            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            unset($data['role']);

            $user->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'data' => $user 
            ], 200);

        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Update failed'], 500);
        }
    }
}