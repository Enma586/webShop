<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Http\Requests\StoreAddressRequest;
use Illuminate\Http\Request;
use Exception;

class AddressController extends Controller
{
    // Añadimos 'district' a la carga de relaciones por defecto
    protected $relations = ['department', 'municipality', 'district'];

    public function index(Request $request)
    {
        $user = $request->user();
        $addresses = Address::with($this->relations)
            ->where('user_id', $user->id)
            ->get();

        return response()->json($addresses, 200);
    }

    public function store(StoreAddressRequest $request)
    {
        try {
            $user = $request->user();
            
            $targetUserId = ($user->role === 'admin' && $request->has('user_id')) 
                ? $request->user_id 
                : $user->id;

            if ($request->is_default) {
                Address::where('user_id', $targetUserId)->update(['is_default' => false]);
            }

            $address = Address::create(array_merge(
                $request->validated(), 
                ['user_id' => $targetUserId]
            ));

            return response()->json([
                'status' => 'success', 
                'data' => $address->load($this->relations)
            ], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();

        $query = Address::with($this->relations);

        if ($user->role !== 'admin') {
            $query->where('user_id', $user->id);
        }

        $address = $query->find($id);

        if (!$address) {
            return response()->json(['status' => 'fail', 'message' => 'Address not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $address], 200);
    }

    public function update(StoreAddressRequest $request, $id)
    {
        try {
            $user = $request->user();

            $address = ($user->role === 'admin')
                ? Address::find($id)
                : Address::where('user_id', $user->id)->find($id);

            if (!$address) {
                return response()->json(['status' => 'fail', 'message' => 'Unauthorized or Not Found'], 404);
            }

            if ($request->is_default) {
                Address::where('user_id', $address->user_id)->update(['is_default' => false]);
            }

            $address->update($request->validated());

            return response()->json([
                'status' => 'success', 
                'data' => $address->load($this->relations)
            ], 200);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        
        $address = ($user->role === 'admin')
            ? Address::find($id)
            : Address::where('user_id', $user->id)->find($id);

        if (!$address) {
            return response()->json(['status' => 'fail', 'message' => 'Unauthorized or Not Found'], 404);
        }

        $address->delete();
        return response()->json(['status' => 'success', 'message' => 'Address deleted'], 200);
    }
}