<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);

        // USAMOS prependToGroup para que tu lector de cookies sea lo PRIMERO
        $middleware->prependToGroup('api', \App\Http\Middleware\JwtFromCookie::class);
        
        // QUITAMOS $middleware->statefulApi(); <--- Borra esta línea si la tienes
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();