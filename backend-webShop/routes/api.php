<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CartItemController; 
use App\Http\Controllers\Api\CheckoutController; 
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\InvoiceController;
use App\Http\Controllers\Api\Customer\CustomerController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']); 
});

Route::get('categories', [CategoryController::class, 'index']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('locations/departments', [LocationController::class, 'getDepartments']);
Route::get('locations/departments/{id}/municipalities', [LocationController::class, 'getMunicipalities']);

Route::middleware('auth:api')->group(function () {
    
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/verify', [AuthController::class, 'verifyToken']);
    });

    Route::prefix('customer')->group(function () {
        Route::get('/profile', [CustomerController::class, 'profile']);
        Route::put('/profile', [CustomerController::class, 'updateProfile']);
    });

    Route::apiResource('addresses', AddressController::class);
    Route::delete('cart-items/clear', [CartItemController::class, 'clear']);
    Route::apiResource('cart-items', CartItemController::class);
    Route::post('checkout', [CheckoutController::class, 'store']);

    Route::get('my-orders', [OrderController::class, 'userOrders']);
    Route::get('my-orders/{id}', [OrderController::class, 'showUserOrder']);
    Route::get('my-invoices', [InvoiceController::class, 'userInvoices']);
    Route::get('my-invoices/{id}', [InvoiceController::class, 'show']);
});

Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    
    Route::prefix('logs')->group(function () {
        Route::get('/products', [AdminController::class, 'getProductLogs']);
        Route::get('/inventory', [AdminController::class, 'getInventoryLogs']);
    });

    Route::get('/dashboard-stats', [AdminController::class, 'getSystemStats']);

    Route::apiResource('users', UserController::class);
    Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
    Route::apiResource('products', ProductController::class)->except(['index', 'show']);
    
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::patch('orders/{id}/status', [OrderController::class, 'updateStatus']);
    
    Route::get('invoices', [InvoiceController::class, 'index']);
    Route::get('invoices/{orderId}/print', [InvoiceController::class, 'printInvoice']);
});