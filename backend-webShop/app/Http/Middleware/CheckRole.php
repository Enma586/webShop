<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckRole
{
    /**
     * Handle an incoming request.
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $role (El rol que pasaremos desde la ruta)
     */
    public function handle(Request $request, Closure $next, string $role): Response
{
    try {
        // 1. Intentamos obtener el usuario explícitamente
        $user = Auth::guard('api')->user();

        // Si no hay usuario, es un problema de TOKEN, no de ROL
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'invalid or missing token. Authentication failed.',
                'debug' => 'Token does not correspond to any user.'
            ], 401);
        }

        // 2. Si hay usuario, verificamos el ROL
        if ($user->role !== $role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only users with the role of ' . $role . ' can access this resource.',
                'required_role' => $role,
                'your_role' => $user->role
            ], 403);
        }

        return $next($request);

    } catch (\Exception $e) {
        // AQUÍ ES DONDE IMPRIMIMOS EL ERROR SI ALGO EXPLOTA
        return response()->json([
            'status' => 'error',
            'message' => 'Error checking user role.',
            'error_print' => $e->getMessage()
        ], 500);
    }
}
}