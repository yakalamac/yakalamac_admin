<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductOption extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'product_options';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
