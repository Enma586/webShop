<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $categories = Category::with('parent')->get();
            return response()->json($categories, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'SERVER_ERROR',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        // Retornamos el objeto puro para que React lo reciba sin capas extra
        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with('children', 'parent')->find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);
        return response()->json($category, 200);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);

        $category->update($request->only(['name', 'parent_id', 'description', 'slug']));

        return response()->json($category, 200);
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) return response()->json(['message' => 'Category not found'], 404);

        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
    }
}