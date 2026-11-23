<?php

namespace App\Http\Controllers;

use App\Models\Phim;
use Illuminate\Http\Request;

class PhimController extends Controller
{
    // Lấy danh sách phim (có thể lọc theo ?trang_thai=dang_chieu)
    public function index(Request $request)
    {
       $query = Phim::orderByDesc('id');

    if ($request->filled('trang_thai')) {
        $query->where('trang_thai', $request->trang_thai);
    }

    if ($request->filled('the_loai')) {
        $query->where('the_loai', 'like', '%' . $request->the_loai . '%');
    }

    return response()->json($query->get());
    }

    // Xem chi tiết 1 phim
    public function show($id)
    {
        $phim = Phim::find($id);
        if (!$phim) {
            return response()->json(['message' => 'Không tìm thấy phim'], 404);
        }

        return response()->json($phim);
    }

    // Thêm phim mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tieu_de' => 'required|string|max:255',
            'the_loai' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'thoi_luong' => 'required|integer|min:1|max:500',
            'ngay_cong_chieu' => 'nullable|date|after_or_equal:today',
            'anh_poster' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'link_trailer' => 'nullable|string|max:255',
            'trang_thai' => 'required|in:dang_chieu,sap_chieu,ngung_chieu',
        ], [
            
            'tieu_de.required' => 'Tên phim không được để trống',
            'thoi_luong.required' => 'Thời lượng phim không được để trống',
            'anh_poster.image' => 'File tải lên phải là hình ảnh',
            'anh_poster.max' => 'Dung lượng ảnh tối đa là 2MB',
        ]);

        if ($request->hasFile('anh_poster')) {
            $file = $request->file('anh_poster');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/posters'), $fileName);
            $validated['anh_poster'] = url('uploads/posters/' . $fileName);
        }

        $phim = Phim::create($validated);
        return response()->json($phim, 201);
    }

    // Cập nhật phim
    public function update(Request $request, $id)
    {
        $phim = Phim::find($id);
        if (!$phim) {
            return response()->json(['message' => 'Không tìm thấy phim'], 404);
        }

        $validated = $request->validate([
            'tieu_de' => 'required|string|max:255',
            'the_loai' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'thoi_luong' => 'required|integer|min:1|max:500',
            'ngay_cong_chieu' => 'nullable|date',
            'anh_poster' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'link_trailer' => 'nullable|string|max:255',
            'trang_thai' => 'required|in:dang_chieu,sap_chieu,ngung_chieu',
        ], [
            'anh_poster.image' => 'File tải lên phải là hình ảnh',
            'anh_poster.max' => 'Dung lượng ảnh tối đa là 2MB',
        ]);

        if ($request->hasFile('anh_poster')) {
            $file = $request->file('anh_poster');
            $fileName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/posters'), $fileName);
            $validated['anh_poster'] = url('uploads/posters/' . $fileName);
        } else {
            // Nếu không chọn ảnh mới thì giữ nguyên ảnh cũ trong DB
            unset($validated['anh_poster']);
        }

        $phim->update($validated);
        return response()->json($phim);
    }

    // Xóa phim
    public function destroy($id)
    {
        $phim = Phim::find($id);
        if (!$phim) {
            return response()->json(['message' => 'Không tìm thấy phim'], 404);
        }

        $phim->delete();
        return response()->json(['message' => 'Đã xóa phim thành công']);
    }
}