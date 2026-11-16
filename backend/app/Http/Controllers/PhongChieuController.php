<?php

namespace App\Http\Controllers;
use App\Models\PhongChieu;
use Illuminate\Http\Request;

class PhongChieuController extends Controller
{
    public function index() {
        $danhSach = PhongChieu::orderBy('id', 'asc')->get();
        return response()->json([
            'message' => 'Thành công!',
            'data' => $danhSach
        ], 200);
    }
//9

    public function store(Request $request) {
        // 1. Ràng buộc dữ liệu trước khi lưu
        $request->validate([
            'ten_phong'  => 'required|string|max:255',
            'loai_phong' => 'required|in:2D,3D,IMAX',
            'so_luong_ghe' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    $loai = $request->input('loai_phong');
                    if ($loai === '2D' && ($value < 50 || $value > 300)) $fail('Phòng 2D phải từ 50 đến 300 ghế.');
                    if ($loai === '3D' && ($value < 30 || $value > 100)) $fail('Phòng 3D (VIP) phải từ 30 đến 100 ghế.');
                    if ($loai === 'IMAX' && ($value < 200 || $value > 500)) $fail('Phòng IMAX phải từ 200 đến 500 ghế.');
                }
            ],
        ]);

        // 2. Nếu không có lỗi thì mới lưu vào database
        $phong = PhongChieu::create($request->all());
        return response()->json(['message' => 'Thành công!', 'data' => $phong], 201);
    }

    public function update(Request $request, $id) {
        $phong = PhongChieu::find($id);
        if(!$phong) return response()->json(['message' => 'Lỗi! Không tìm thấy phòng.'], 404);

        // 1. Ràng buộc dữ liệu tương tự như hàm thêm mới để tránh người dùng sửa lách luật
        $request->validate([
            'ten_phong'  => 'required|string|max:255',
            'loai_phong' => 'required|in:2D,3D,IMAX',
            'so_luong_ghe' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    $loai = $request->input('loai_phong');
                    if ($loai === '2D' && ($value < 50 || $value > 300)) $fail('Phòng 2D phải từ 50 đến 300 ghế.');
                    if ($loai === '3D' && ($value < 30 || $value > 100)) $fail('Phòng 3D (VIP) phải từ 30 đến 100 ghế.');
                    if ($loai === 'IMAX' && ($value < 200 || $value > 500)) $fail('Phòng IMAX phải từ 200 đến 500 ghế.');
                }
            ],
        ]);

        // 2. Cập nhật vào DB
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