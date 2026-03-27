<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UserController extends Controller
{
    public function index()
    {
        try {
            $users = User::all();
            return response()->json([
                'status' => 'success',
                'data' => $users
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Failed to fetch users'], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json(['status' => 'success', 'data' => $user], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'An error occurred'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:100',
                'username' => 'required|string|unique:users,username',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|min:8',
                'role'     => 'required|in:admin,customer',
                'status'   => 'required|in:active,banned,inactive' // <-- AGREGADO
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'fail', 'errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            $data['password'] = Hash::make($data['password']); // Encriptar siempre

            $user = User::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully',
                'data' => $user
            ], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'User creation failed'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name'     => 'sometimes|string|max:100',
                'username' => 'sometimes|string|unique:users,username,' . $id,
                'email'    => 'sometimes|email|unique:users,email,' . $id,
                'role'     => 'sometimes|in:admin,customer',
                'status'   => 'sometimes|in:active,banned,inactive', // <-- AGREGADO
                'password' => 'sometimes|nullable|min:8'
            ]);

            if ($validator->fails()) {
                return response()->json(['status' => 'fail', 'errors' => $validator->errors()], 422);
            }

            $data = $request->all();
            
            if (!empty($data['password'])) {
                $data['password'] = Hash::make($data['password']);
            } else {
                unset($data['password']);
            }

            $user->update($data);

            return response()->json([
                'status' => 'success',
                'message' => 'User updated successfully',
                'data' => $user
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Update failed'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['status' => 'success', 'message' => 'User deleted successfully'], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => 'Delete failed'], 500);
        }
    }
}