<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    // Define the table name (optional if it matches the model name in snake_case)
    protected $table = 'requests';

    // Primary key specification
    protected $primaryKey = 'request_id';

    // Specify fillable attributes for mass assignment
    protected $fillable = [
        'request_status',
        'helper_id',
        'elder_id',
        'service_id',
        'elder_address',
        'date',
        'time',
        'price',
        'service_hour'
    ];

    // Define relationships

    /**
     * The helper associated with the request.
     */
    public function helper()
    {
        return $this->belongsTo(User::class, 'helper_id');
    }

    /**
     * The elder or family member associated with the request.
     */
    public function elder()
    {
        return $this->belongsTo(User::class, 'elder_id');
    }

    /**
     * The service associated with the request.
     */
    public function service()
    {
        return $this->belongsTo(Services::class, 'service_id');
    }
}
