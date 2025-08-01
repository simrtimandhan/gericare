<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking', function (Blueprint $table) {
            $table->id('booking_id'); // Primary Key
            $table->string('booking_status');
            $table->unsignedBigInteger('request_id'); // Foreign Key for Request
            $table->timestamps();


            // Foreign Key Constraints
            $table->foreign('request_id')->references('request_id')->on('requests')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking');
    }
};
