<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceOption extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'place_options';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
