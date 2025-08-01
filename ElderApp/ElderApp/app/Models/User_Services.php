<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Services;


class User_Services extends Model
{
    protected $table = 'user_services'; 
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'service_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class); // Correct relationship to the User model
    }

    public function service()
    {
        return $this->belongsTo(Service::class); // If you also need the related services
    }
}
