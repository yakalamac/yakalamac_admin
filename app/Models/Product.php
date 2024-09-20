<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $table = 'products';
    protected $primaryKey = 'uuid';
    public $incrementing = false;

    public function place(){
        return $this->hasOne(Place::class, 'uuid', 'place_id');
    }
}
