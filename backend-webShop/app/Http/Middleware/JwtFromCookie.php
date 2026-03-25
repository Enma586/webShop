<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        // if exists jswt_token cookie and no bearer token in the header, set the token from the cookie to the header
        if ($request->hasCookie('jwt_token') && !$request->bearerToken()) {
            $token = $request->cookie('jwt_token');
            // put on token in the header, until the header is set, the jwt auth will not work
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}