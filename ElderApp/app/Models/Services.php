<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Services extends Model
{
    use CrudTrait;
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'service_type',
        'service_name'
    ];
}
