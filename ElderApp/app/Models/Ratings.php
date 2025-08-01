<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ratings extends Model
{
    use CrudTrait;
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'rating',
        'description',
        'request_id',
        'booking_id',
        'helper_id'
    ];

    public function helper()
    {
        return $this->belongsTo(User::class, 'helper_id');
    }


    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }

    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
