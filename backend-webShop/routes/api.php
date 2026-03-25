<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\CategoryController; // Only this line was changed to match the Admin folder
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Customer\CustomerController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CartItemController; 
use App\Http\Controllers\Api\CheckoutController; 
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\LocationController;

/*
|--------------------------------------------------------------------------
| API Routes - webShop
|--------------------------------------------------------------------------
*/

// 1. PUBLIC ROUTES (Access for all visitors and guests)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']); 
});

// Public catalog and geographical locations
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Route to fetch departments and municipalities (needed for registration/shipping)
Route::get('locations', [LocationController::class, 'getLocations']);


// 2. PROTECTED ROUTES (Require valid JWT Token/Cookie)
Route::middleware('auth:api')->group(function () {
    
    // Session Management (Matches React verification logic)
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/verify', [AuthController::class, 'verifyToken']);
    });

    // Shipping addresses
    Route::apiResource('addresses', AddressController::class);

    // Shopping cart management
    Route::apiResource('cart-items', CartItemController::class)->only(['index', 'store', 'destroy']);

    // Checkout process
    Route::post('checkout', [CheckoutController::class, 'store']);

    // Personal order history
    Route::get('my-orders', [OrderController::class, 'userOrders']);
    Route::get('my-orders/{id}', [OrderController::class, 'showUserOrder']);
});


// 3. CUSTOMER SPECIFIC ROUTES (Role: customer only)
Route::middleware(['auth:api', 'role:customer'])->prefix('customer')->group(function () {
    Route::get('/profile', [CustomerController::class, 'profile']);
    Route::put('/profile', [CustomerController::class, 'updateProfile']);
});


// 4. ADMINISTRATIVE ROUTES (Role: admin only)
Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    // User management
    Route::apiResource('users', UserController::class);
    
    // Catalog management (Full CRUD for categories and products)
    // Index and Show remain public; creation, editing, and deletion are handled here
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);

    // Global Order Management (Sales administration panel)
    Route::get('orders', [OrderController::class, 'index']);
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
});