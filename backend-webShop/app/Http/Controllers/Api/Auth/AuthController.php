<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash; // Importante para el hashing manual si es necesario
use Exception;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $credentials = [
                'username' => $request->username,
                'password' => $request->password,
                'status'   => 'active'
            ];

            if (!$token = Auth::guard('api')->attempt($credentials)) {
                return response()->json([
                    'error' => 'Unauthorized or account suspended'
                ], 401);
            }

            $user = Auth::guard('api')->user();

            $cookie = cookie('jwt_token', $token, 60 * 24, '/', null, false, true);

            return response()->json([
                'status' => 'success',
                'user' => $user,
                'token' => $token,
            ], 200)->withCookie($cookie);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name'     => 'required|string|max:100',
                'username' => 'required|string|max:100|unique:users,username',
                'email'    => 'required|email|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = User::create([
                'name'     => $request->name,
                'username' => $request->username,
                'email'    => $request->email,
                'password' => Hash::make($request->password),
                'role'     => 'customer',
                'status'   => 'active'
            ]);
            return response()->json([
                'status'  => 'success',
                'message' => 'Registration successful. Please login to continue.',
                'user'    => $user
            ], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'Registration failed', 'details' => $e->getMessage()], 500);
        }
    }

    public function verifyToken(Request $request)
    {
        $token = $request->cookie('jwt_token');

        if (!$token) {
            return response()->json(['status' => 'guest', 'message' => 'No session'], 200);
        }

        try {
            $request->headers->set('Authorization', 'Bearer ' . $token);
            $user = Auth::guard('api')->user();

            if (!$user || $user->status !== 'active') {
                return response()->json(['status' => 'guest', 'message' => 'Account inactive'], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => ['user' => $user]
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'guest'], 200);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken() ?: $request->cookie('jwt_token');
            if ($token) {
                JWTAuth::setToken($token)->invalidate();
            }

            return response()->json(['status' => 'success', 'message' => 'Session terminated'], 200)
                ->withCookie(cookie()->forget('jwt_token', '/'))
                ->withCookie(cookie()->forget('jwt_token', '/api'))
                ->header('Access-Control-Allow-Credentials', 'true');
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}
