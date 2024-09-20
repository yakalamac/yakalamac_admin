<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceLogo extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'place_logos';
    protected $primaryKey = 'uuid';
    public $incrementing = false;
}
