<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'booking';

    // Primary key
    protected $primaryKey = 'booking_id';

    // Fillable attributes
    protected $fillable = [
        'booking_status',
        'request_id',
    ];

    // Define relationships
    public function request()
    {
        return $this->belongsTo(Request::class, 'request_id');
    }
}
