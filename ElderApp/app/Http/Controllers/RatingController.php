<?php

namespace App\Http\Controllers;


use App\Models\Ratings;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\RequestEmail;

class RatingController extends Controller
{
    /**
     * Create a new request.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function createRating(HttpRequest $request)
    {
        // Validate the incoming request
        $validator = Validator::make($request->all(), [
            'helper_id' => 'required|exists:users,id',
            'request_id' => 'required|exists:requests,request_id',
            'booking_id' => 'required|exists:booking,booking_id',
            'review' => 'required|string',
            'rating' => 'required|string',
        ]);


        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->all()
            ], 422);
        }

        
        $newRequest = Ratings::create([
            'helper_id' => $request->helper_id,
            'request_id' => $request->request_id,
            'booking_id' => $request->booking_id,
            'rating' => $request->rating,
            'description' => $request->review
        ]);

        // app()->call('App\Http\Controllers\FcmController@sendFcmNotification', [
        //     'request' => new HttpRequest([
        //         'user_id' => $request->helper_id,
        //         'title' => 'Request Review',
        //         'body' => "You have been rated {$request->rating} for the request"
        //     ])
        // ]);


        return response()->json([
            'success' => true,
            'data' => $newRequest,
            'message' => 'Rating Added Successfully'
        ], 200);
    }


    public function getRating($id)
    {
        $rating = Ratings::where('request_id', $id)->first();

        if ($rating) {
            return response()->json([
                'message' => 'Rating Fetched successfully.',
                'rating' => $rating,
            ], 200);
        }

        return response()->json([
            'message' => 'Rating not found.',
        ], 404);
    }


    public function getAverageRating($id)
    {
        $average = Ratings::where('helper_id', $id)->avg('rating');
    
        if ($average !== null) {
            return response()->json([
                'helper_id' => $id,
                'average_rating' => round($average, 2),
            ]);
        }
    
        return response()->json([
            'message' => 'No ratings found for this helper.',
        ], 404);
    }

}