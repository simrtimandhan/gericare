<?php

namespace App\Http\Controllers;

use App\Models\Request;
use App\Models\Booking;
use App\Models\User;
use App\Models\Services;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\RequestEmail;

class RequestController extends Controller
{
    /**
     * Create a new request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createRequest(HttpRequest $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'helper_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'elder_address' => 'required|string',
            'date' => 'required|date_format:d/m/Y',
            'time' => 'required|date_format:H:i',
            'elder_id' => 'required|exists:users,id',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->all()
            ], 422);
        }

        $date = Carbon::createFromFormat('d/m/Y', $request->input('date'))->toDateString();

        // Check if the helper is already booked for this time slot
        $existingRequest = Request::where('helper_id', $request->helper_id)
            ->where('date', $date)
            ->where('time', $request->time)
            ->whereIn('request_status', ['pending', 'accepted'])
            ->first();

        if ($existingRequest) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot is already booked for the selected helper'
            ], 422);
        }
        $helperData = User::where('id', $request->helper_id)->first();
        // Create the request entry
        $newRequest = Request::create([
            'request_status' => 'pending', // Initial status
            'helper_id' => $request->helper_id,
            'elder_id' => $request->elder_id,
            'service_id' => $request->service_id,
            'elder_address' => $request->elder_address,
            'date' => $date,
            'time' => $request->time,
            'price' => $request->price,
            'service_hour' => $request->service_hour
        ]);

        Mail::to($helperData->email)->send(new RequestEmail([
            'name' => $helperData->first_name,
            'message' => 'You have a new request. Kindly check your dashboard.',
       ]));

        // Optionally: You can send a notification to the helper here if needed

        // Return the response
        return response()->json([
            'success' => true,
            'data' => $newRequest,
            'message' => 'Request Sent Successfully'
        ], 200);
    }

    public function acceptRequest($id)
    {
        $request = Request::where('request_id', $id)->first();

        if ($request) {
            $request->update([
                'request_status' => 'accepted',
            ]);
            $booking = Booking::create([
                'request_id' => $request->request_id,
                'booking_status' => 'accepted'
            ]);
            $elderData = User::where('id', $request->elder_id)->first();

            Mail::to($elderData->email)->send(new RequestEmail([
                'name' => $elderData->first_name,
                'message' => 'Your request has been accepted. Kindly check your dashboard.',
           ]));

            return response()->json([
                'message' => 'Request Accepted successfully.',
                'request' => $request,
                'booking' => $booking
            ], 200);
        }

        return response()->json([
            'message' => 'Request not found.',
        ], 404);
    }

    public function rejectRequest($id)
    {
        $request = Request::where('request_id', $id)->first();

        if ($request) {
            $request->update([
                'request_status' => 'rejected',
            ]);
            $elderData = User::where('id', $request->elder_id)->first();

            Mail::to($elderData->email)->send(new RequestEmail([
                'name' => $elderData->first_name,
                'message' => 'Your request has been cancelled. Kindly check your dashboard.',
            ]));

            return response()->json([
                'message' => 'Request Rejected successfully.',
                'request' => $request,
            ], 200);
        }

        return response()->json([
            'message' => 'Request not found.',
        ], 404);
    }


    public function getRequest($id)
    {
        $request = Request::where('request_id', $id)->first();

    
        if (!$request) {
            return response()->json([
                'success' => false,
                'message' => 'Request not found',
            ], 404);
        }


        $elderData = User::where('id', $request->elder_id)->first();
        $helperData = User::where('id', $request->helper_id)->first();
    
        return response()->json([
            'success' => true,
            'data' => [
                'elder' => $elderData,
                'helper' => $helperData,
                'request' => $request,
            ],
            'message' => 'User details with services and images'
        ], 200);
    }

 
    public function getHelperRequests($helperId)
    {
        $helper = User::find($helperId);
        if (!$helper) {
            return response()->json([
                'success' => false,
                'message' => 'Helper not found'
            ], 404);
        }

        $requests = Request::where('helper_id', $helperId)
            ->with(['service:id,service_name'])
            ->with(['elder:id,first_name,last_name,phone_number,email'])
            ->orderBy('created_at', 'desc')
            ->get();

        if ($requests->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No requests found for this helper'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $requests
            ],
            'message' => 'Helper requests retrieved successfully'
        ], 200);
    }

    public function getElderRequests($elderId)
    {
        $helper = User::find($elderId);
        if (!$helper) {
            return response()->json([
                'success' => false,
                'message' => 'Elder not found'
            ], 404);
        }

        $requests = Request::where('elder_id', $elderId)
            ->with(['service:id,service_name'])
            ->with(['helper:id,id,first_name,last_name,phone_number,email,recent_photo,hourly_charges'])
            ->orderBy('created_at', 'desc')
            ->get();

        if ($requests->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No requests found for this elder'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $requests
            ],
            'message' => 'Elder requests retrieved successfully'
        ], 200);
    }

    public function cancelRequest($id)
    {
        $request = Request::where('request_id', $id)->first();
        $booking = Booking::where('request_id', $id)->first();

        if ($request) {
            $request->update([
                'request_status' => 'cancelled',
            ]);

            if($booking){   
            $booking->update([
                'booking_status' => 'cancelled',
            ]);
        }
            
            $elderData = User::where('id', $request->elder_id)->first();
            $helperData = User::where('id', $request->helper_id)->first();

            Mail::to($elderData->email)->send(new RequestEmail([
                'name' => $elderData->first_name,
                'message' => 'Your request has been cancelled. Kindly check your dashboard.',
            ]));

            Mail::to($helperData->email)->send(new RequestEmail([
                'name' => $helperData->first_name,
                'message' => 'Your request has been cancelled. Kindly check your dashboard.',
            ]));

            return response()->json([
                'message' => 'Request Cancelled successfully.',
                'request' => $request,
                'booking' => $booking
            ], 200);
        }

        return response()->json([
            'message' => 'Request not found.',
        ], 404);
    }

    public function editRequest(HttpRequest $request)
{
    // Validate the incoming request
    $validator = Validator::make($request->all(), [
        'helper_id' => 'required|exists:users,id',
        'service_id' => 'required|exists:services,id',
        'elder_address' => 'required|string',
        'date' => 'required|date_format:d/m/Y',
        'time' => 'required|date_format:H:i',
        'elder_id' => 'required|exists:users,id',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()->all()
        ], 422);
    }

    // Check if the request exists
    $existingRequest = Request::where('request_id', $request->request_id)->first();

    if (!$existingRequest) {
        return response()->json([
            'success' => false,
            'message' => 'Request not found'
        ], 404);
    }

    $date = Carbon::createFromFormat('d/m/Y', $request->input('date'))->toDateString();

    $checkRequest = Request::where('helper_id', $request->helper_id)
            ->where('date', $date)
            ->where('time', $request->time)
            ->whereIn('request_status', ['pending', 'accepted'])
            ->first();

        if ($checkRequest) {
            return response()->json([
                'success' => false,
                'message' => 'This time slot is already booked for the selected helper'
            ], 422);
        }

    $helperData = User::where('id', $request->helper_id)->first();

    // Update the request entry
    $existingRequest->update([
        'helper_id' => $request->helper_id,
        'elder_id' => $request->elder_id,
        'service_id' => $request->service_id,
        'elder_address' => $request->elder_address,
        'date' => $date,
        'time' => $request->time,
        'price' => $request->price,
        'service_hour' => $request->service_hour
    ]);

    // Notify the helper about the update (Optional)
    Mail::to($helperData->email)->send(new RequestEmail([
        'name' => $helperData->first_name,
        'message' => 'Your request has been updated. Kindly check your dashboard.',
    ]));

    // Optionally: Send a notification to the helper about the update if needed

    // Return the response
    return response()->json([
        'success' => true,
        'data' => $existingRequest,
        'message' => 'Request updated successfully'
    ], 200);
}
}
