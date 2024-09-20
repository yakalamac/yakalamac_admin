<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlacePhoto extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'place_photos';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
