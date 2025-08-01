<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FcmController;


Route::get('/', function () {
    return view('welcome');
});
Route::put('update-device-token', [FcmController::class, 'updateDeviceToken']);
Route::post('send-fcm-notification', [FcmController::class, 'sendFcmNotification']);