<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceAddress extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'place_addresses';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
