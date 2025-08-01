<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\FcmController;




Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::controller(AuthController::class)->group(function(){
    Route::post('register', 'register');
});

Route::controller(AuthController::class)->group(function(){
    Route::post('login', 'login');
});

Route::controller(ServiceController::class)->group(function(){
    Route::post('create-service', 'createService');
});


Route::controller(ServiceController::class)->group(function(){
    Route::get('services', 'getAllServices');
});

Route::controller(AuthController::class)->group(function(){
    Route::get('user/{id}', 'getUser');
});

Route::controller(AuthController::class)->group(function(){
    Route::get('user-helpers', 'getHelpers');
});

Route::controller(AuthController::class)->group(function () {
    Route::middleware('auth:sanctum')->get('/user/details', 'getUserDetails');
});

Route::controller(AuthController::class)->group(function(){
    Route::post('user/{id}', 'editProfile');
});

Route::controller(AuthController::class)->group(function(){
    Route::post('user/delete/{id}', 'deleteProfile');
});

Route::controller(RequestController::class)->group(function(){
    Route::post('create-request', 'createRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/{id}', 'getRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/accept/{id}', 'acceptRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/reject/{id}', 'rejectRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/cancel/{id}', 'cancelRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('helper/requests/{helperId}', 'getHelperRequests');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('elder/requests/{elderId}', 'getElderRequests');
});

Route::controller(RequestController::class)->group(function(){
    Route::post('request/edit', 'editRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/start/{id}', 'startRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/end/{id}', 'endRequest');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/completed/{id}', 'completeBooking');
});

Route::controller(RequestController::class)->group(function(){
    Route::get('request/status/{id}', 'getRequestStatus');
});

Route::controller(RatingController::class)->group(function(){
    Route::post('rating/new', 'createRating');
});

Route::controller(FcmController::class)->group(function(){
    Route::post('notification/update', 'updateDeviceToken');
});

Route::controller(FcmController::class)->group(function(){
    Route::post('notification/send', 'sendFcmNotification')->name('notification.send');;
});

Route::controller(RatingController::class)->group(function(){
    Route::get('rating/status/{id}', 'getRating');
});


Route::controller(RatingController::class)->group(function(){
    Route::get('rating/helper/{id}', 'getAverageRating');
});


Route::controller(AuthController::class)->group(function(){
    Route::post('user/{id}/update-location', 'updateLocation');
});


Route::controller(AuthController::class)->group(function(){
    Route::get('user/{id}/get-location', 'getLocation');
});


Route::controller(AuthController::class)->group(function(){
    Route::post('user/{id}/add-elder', 'addElderToProfile');
});