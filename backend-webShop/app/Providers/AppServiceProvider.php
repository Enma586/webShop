<?php

namespace App\Providers;

use App\Models\OrderItem;
use App\Models\Product;
use App\Observers\OrderItemObserver;
use App\Observers\ProductObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the ProductObserver to start tracking price and stock changes
        Product::observe(ProductObserver::class);
        OrderItem::observe(OrderItemObserver::class);
    }
}
