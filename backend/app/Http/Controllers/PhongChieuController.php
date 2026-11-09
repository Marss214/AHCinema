<?php

namespace App\Http\Controllers;
use App\Models\PhongChieu;
use Illuminate\Http\Request;

class PhongChieuController extends Controller
{
    public function index() {
        return response()->json(PhongChieu::all(), 200);
    }

    public function store(Request $request) {
        $phong = PhongChieu::create($request->all());
        return response()->json(['message' => 'Thành công!', 'data' => $phong], 201);
    }

    public function update(Request $request, $id) {
        $phong = PhongChieu::find($id);
        if(!$phong) return response()->json(['message' => 'Lỗi!'], 404);
        $phong->update($request->all());
        return response()->json(['message' => 'Sửa thành công!', 'data' => $phong], 200);
    }

    public function destroy($id) {
        $phong = PhongChieu::find($id);
        if(!$phong) return response()->json(['message' => 'Lỗi!'], 404);
        $phong->delete();
        return response()->json(['message' => 'Xóa thành công!'], 200);
    }
}
