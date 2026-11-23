<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Phim extends Model
{
    use HasFactory;

    protected $table = 'phim';

    protected $fillable = [
        'tieu_de',
        'the_loai',
        'mo_ta',
        'thoi_luong',
        'ngay_cong_chieu',
        'anh_poster',
        'link_trailer',
        'trang_thai',
    ];
}