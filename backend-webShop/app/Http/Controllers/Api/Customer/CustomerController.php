<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Necessary to encrypt the password
use Exception;

class CustomerController extends Controller
{
    /**
     * GET - Show authenticated customer profile
     */
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ], 200);
    }

    /**
     * PUT - Update authenticated customer profile (including password)
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();

            // Validation rules
            $validator = Validator::make($request->all(), [
                'name'     => 'sometimes|string|max:100',
                'username' => 'sometimes|string|unique:users,username,' . $user->id,
                'email'    => 'sometimes|email|unique:users,email,' . $user->id,
                'password' => 'sometimes|min:8|confirmed', // 'confirmed' looks for password_confirmation
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'fail',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get standard profile data
            $data = $request->only(['name', 'username', 'email']);

            // Update password only if provided
            if ($request->filled('password')) {
                $data['password'] = Hash::make($request->password);
            }

            // Strictly prevent customers from changing their own role
            unset($data['role']);

            $user->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profile updated successfully',
                'user' => $user
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Update failed'
            ], 500);
        }
    }
}