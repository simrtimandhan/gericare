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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->nullable()->unique();
            $table->string('password');
            $table->string('phone_number')->unique();
            $table->integer('age');
            $table->string('gender');
            $table->string('recent_photo')->nullable();
            $table->string('job')->nullable();
            $table->string('cnic')->nullable();
            $table->string('cnic_photo')->nullable();
            $table->string('services')->nullable();
            $table->string('highest_qualification')->nullable();
            $table->string('highest_qualification_document')->nullable();
            $table->integer('hourly_charges')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->integer('elder_id')->nullable();
            $table->string('relation_to_elder')->nullable();
            $table->string('user_type');
            $table->timestamp('created_at')->nullable();
        });
        

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
