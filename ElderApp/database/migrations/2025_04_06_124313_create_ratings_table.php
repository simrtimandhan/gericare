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
        Schema::create('ratings', function (Blueprint $table) {
            $table->id();
            $table->string('rating');
            $table->string('description');
            $table->unsignedBigInteger('request_id'); // Foreign Key for Request
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('helper_id');


            $table->foreign('request_id')->references('request_id')->on('requests')->onDelete('cascade');
            $table->foreign('booking_id')->references('booking_id')->on('booking')->onDelete('cascade');
            $table->foreign('helper_id')->references('id')->on('users')->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ratings');
    }
};
