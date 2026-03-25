<?php

// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    // 1. Poné la URL exacta de tu frontend (sin el / al final)
    'allowed_origins' => ['http://localhost:5173'], 
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    // 2. ESTO ES VITAL: Debe ser true para que el 401 desaparezca
    'supports_credentials' => true, 
];