<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceOpeningHours extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'place_opening_hours';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
