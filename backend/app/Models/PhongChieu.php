<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PhongChieu extends Model
{
    use HasFactory;
    protected $table = 'phong_chieu';
    protected $fillable = ['ten_phong', 'suc_chua', 'loai_phong'];
}