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
        Schema::create('requests', function (Blueprint $table) {
            $table->id('request_id'); // Primary Key
            $table->string('request_status');
            $table->unsignedBigInteger('helper_id'); // Foreign Key for Helper
            $table->unsignedBigInteger('elder_id'); // Foreign Key for Elder/Family Member
            $table->unsignedBigInteger('service_id'); // Foreign Key for Service
            $table->string('elder_address');
            $table->date('date'); // Date for the request
            $table->time('time'); // Time for the request
            $table->string('price');
            $table->string('service_hour');
            $table->timestamps();


            // Foreign Key Constraints
            $table->foreign('helper_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('elder_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('service_id')->references('id')->on('services')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('requests');
    }
};
