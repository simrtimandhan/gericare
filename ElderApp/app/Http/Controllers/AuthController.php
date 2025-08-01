<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User_Services;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone_number' => 'required|string|max:15|min:11|unique:users',
            'age' => 'required|integer|min:1',
            'gender' => 'required|in:male,female,other',
            'recent_photo' => 'nullable|image|max:2048',
            'job' => 'nullable|string|max:255',
            'cnic' => 'nullable|string|max:255',
            'cnic_photo' => 'nullable|image|max:2048',
            'services' => 'nullable|string',
            'highest_qualification' => 'nullable|string|max:255',
            'highest_qualification_document' => 'nullable|image|max:2048',
            'hourly_charges' => 'nullable|numeric',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'state' => 'nullable|string',
            'elder_id' => 'nullable|integer',
            'relation_to_elder' => 'nullable|string|max:255',
            'user_type' => 'required|in:elder,helper,family,admin',
            'services' => 'nullable|array',
            'status' => 'nullable|in:active,inactive',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->all()
            ], 422);
        }
        // if ($request->hasFile('recent_photo')) {
        //     Log::info('File detected:', ['name' => $request->file('recent_photo')->getClientOriginalName()]);
        // } else {
        //     Log::info('No file detected for recent_photo');
        // }

        $recent_photo_path = $request->file('recent_photo') ? $request->file('recent_photo')->store('photos', 'public') : null;
        $cnic_photo_path = $request->file('cnic_photo') ? $request->file('cnic_photo')->store('photos', 'public') : null;
        $highest_qualification_document_path = $request->file('highest_qualification_document') ? $request->file('highest_qualification_document')->store('photos', 'public') : null;
        // $recent_photo_path = $request->file('recent_photo') ? $request->file('recent_photo')->store('photos') : null;
        // $cnic_photo_path = $request->file('cnic_photo') ? $request->file('cnic_photo')->store('cnic_photos') : null;
        // $highest_qualification_document_path = $request->file('highest_qualification_document') ? $request->file('highest_qualification_document')->store('highest_qualification_document') : null;

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone_number' => $request->phone_number,
            'age' => $request->age,
            'gender' => $request->gender,
            'recent_photo' => $recent_photo_path ?? null,
            'job' => $request->job,
            'cnic' => $request->cnic,
            'city' => $request->city,
            'state' => $request->state,
            'cnic_photo' => $cnic_photo_path ?? null,
            'highest_qualification' => $request->highest_qualification,
            'highest_qualification_document' => $highest_qualification_document_path ?? null,
            'hourly_charges' => $request->hourly_charges,
            'address' => $request->address,
            'elder_id' => $request->elder_id,
            'relation_to_elder' => $request->relation_to_elder,
            'user_type' => $request->user_type,
            'services' => $request->services ? json_encode($request->services) : null,
            'status' => $request->status ? $request->status : 'active'
        ]);

        if ($request->has('services') && !empty($request->services)) {
            $userId = $user->id;
            $serviceIds = $request->services;
    
            $userServicesData = [];
            foreach ($serviceIds as $serviceId) {
                $userServicesData[] = [
                    'user_id' => $userId,
                    'service_id' => $serviceId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            DB::table('user_services')->insert($userServicesData);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $success['name'] = $user->first_name . ' ' . $user->last_name;
        $success['token'] = $user->createToken('auth_token')->plainTextToken;
        $success['user_id'] = $user->id;


        return response()->json([
            'success' => true,
            'data' => $success,
            'user' => $user,
            'message' => 'User Registered Successfully'
        ], 200);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'required|string',
            'password' => 'required|string'
        ]);
    
        // if ($validator->fails()) {
        //     return response()->json(['success' => false, 'message' => $validator->errors()], 422);
        // }
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->all()
            ], 422);
        }
    
        if (!Auth::attempt($request->only('phone_number', 'password'))) {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }
    
        $user = Auth::user();
    
        $token = $user->createToken($user->phone_number.'-AuthToken')->plainTextToken;
    
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
           'token' => $token,
            'user' => $user
        ], 200);
    }

    // public function getUser($id)
    // {
    //     $user = User::find($id);
    //     $userService = User_Services::with('user')->where('user_id', $id)->get();


    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found'
    //         ], 404);
    //     }

    //     // Return user data
    //     return response()->json([
    //         'success' => true,
    //         'data' => $userService,
    //         'message' => 'User details'
    //     ], 200);
    // }

    public function getUser($id)
{
    // Fetch the user and their services
    $user = User::find($id);

    // If user doesn't exist
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found',
        ], 404);
    }

    // Fetch the user's services
    $userService = User_Services::with(['user', 'service'])->where('user_id', $id)->get();

    // Get the full path to the user's image (if it exists)
    $recentPhotoUrl = $user->recent_photo ? asset('storage/' . $user->recent_photo) : null;
    $cnicPhotoUrl = $user->cnic_photo ? asset('storage/' . $user->cnic_photo) : null;

    // Return the user data along with their services and image URLs
    return response()->json([
        'success' => true,
        'data' => [
            'user' => $user,
            'services' => $userService,
            'recent_photo_url' => $recentPhotoUrl,
            'cnic_photo_url' => $cnicPhotoUrl,
        ],
        'message' => 'User details with services and images'
    ], 200);
}

public function getUserDetails(Request $request)
{
    // Fetch the authenticated user from the token
    Log::info('Request Headers:', $request->headers->all());
    $user = Auth::user();

    // If user doesn't exist (this case is unlikely if token is valid)
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // Fetch the user's services (adjust the relationship or model if needed)
    $userServices = $user->services()->get(); // Assuming a `services` relationship is defined in the `User` model

    // Get the full path to the user's image (if it exists)
    $recentPhotoUrl = $user->recent_photo ? asset('storage/' . $user->recent_photo) : null;
    $cnicPhotoUrl = $user->cnic_photo ? asset('storage/' . $user->cnic_photo) : null;

    // Return the user data along with their services and image URLs
    return response()->json([
        'success' => true,
        'data' => [
            'user' => $user,
            'services' => $userServices,
            'recent_photo_url' => $recentPhotoUrl,
            'cnic_photo_url' => $cnicPhotoUrl,
        ],
        'message' => 'User details with services and images'
    ], 200);
}

public function editProfile(Request $request, $id)
{
    // Find the user by ID
    $user = User::find($id);

    // If the user doesn't exist
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'first_name' => 'nullable|string|max:255',
        'last_name' => 'nullable|string|max:255',
        'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:8',
        'phone_number' => 'nullable|string|max:15',
        'age' => 'nullable|integer|min:1',
        'gender' => 'nullable|in:male,female,other',
        'recent_photo' => 'nullable|image|max:9048',
        'job' => 'nullable|string|max:255',
        'cnic_photo' => 'nullable|image|max:2048',
        'services' => 'nullable|array',
        'highest_qualification' => 'nullable|string|max:255',
        'highest_qualification_document' => 'nullable|image|max:2048',
        'hourly_charges' => 'nullable|numeric',
        'address' => 'nullable|string',
        'city' => 'nullable|string',
        'state' => 'nullable|string',
        'relation_to_elder' => 'nullable|string|max:255',
        'user_type' => 'nullable|in:elder,helper,family,admin',
        'services' => 'nullable|array',
    ]);

    if ($validator->fails()) {
        return response()->json(['success' => false, 'message' => $validator->errors()], 422);
    }

    $recent_photo_path = $request->file('recent_photo') ? $request->file('recent_photo')->store('photos', 'public') : null;

    $user->update(array_filter([
        'first_name' => $request->first_name,
        'last_name' => $request->last_name,
        'email' => $request->email,
        'phone_number' => $request->phone_number,
        'age' => $request->age,
        'gender' => $request->gender,
        'job' => $request->job,
        'highest_qualification' => $request->highest_qualification,
        'hourly_charges' => $request->hourly_charges,
        'address' => $request->address,
        'city' => $request->city,
        'state' => $request->state,
        'relation_to_elder' => $request->relation_to_elder,
        'user_type' => $request->user_type,
        'services' => $request->services ? json_encode($request->services) : null,
        'recent_photo' => $recent_photo_path ?? null,
    ]));

    // Handle file uploads if they exist
    if ($request->hasFile('recent_photo')) {
        $user->recent_photo = $request->file('recent_photo')->store('photos');
    }

    if ($request->hasFile('cnic_photo')) {
        $user->cnic_photo = $request->file('cnic_photo')->store('cnic_photos');
    }

    if ($request->hasFile('highest_qualification_document')) {
        $user->highest_qualification_document = $request->file('highest_qualification_document')->store('qualification_documents');
    }

    // Update password if provided
    if ($request->filled('password')) {
        $user->password = Hash::make($request->password);
    }

    $user->save();

    // Update services if provided
    if ($request->has('services') && !empty($request->services)) {
            $userId = $user->id;
            $serviceIds = $request->services;
    
            $userServicesData = [];
            foreach ($serviceIds as $serviceId) {
                $userServicesData[] = [
                    'user_id' => $userId,
                    'service_id' => $serviceId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }
            DB::table('user_services')->insert($userServicesData);
    }

    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
        'data' => $user
    ], 200);
}

public function deleteProfile($id)
{
    // Find the user by ID
    $user = User::find($id);

    // If the user doesn't exist
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // Delete related services records
    //$user->services()->detach();

    // Delete the user
    $user->delete();

    return response()->json([
        'success' => true,
        'message' => 'User profile deleted successfully'
    ], 200);
}

public function getHelpers()
{
    // Fetch all users who are helpers
    $users = User::where('user_type', 'helper')->get();

    // If no helpers found
    if ($users->isEmpty()) {
        return response()->json([
            'success' => false,
            'message' => 'No helpers found',
        ], 404);
    }

    // Process each user to add their photo URLs
    $users = $users->map(function($user) {
        $user->recent_photo_url = $user->recent_photo ? asset('storage/' . $user->recent_photo) : null;
        $user->cnic_photo_url = $user->cnic_photo ? asset('storage/' . $user->cnic_photo) : null;
        $user->services = $user->services ? json_decode($user->services) : null;
        return $user;
    });

    // Return the users data
    return response()->json([
        'success' => true,
        'data' => [
            'users' => $users,
        ],
        'message' => 'Helpers retrieved successfully'
    ], 200);
}

public function updateLocation(Request $request, $id)
{
    // Find the user by ID
    $user = User::find($id);

    // If the user doesn't exist
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // Validate incoming data
    $validator = Validator::make($request->all(), [
        'latitude' => 'required|numeric|between:-90,90',
        'longitude' => 'required|numeric|between:-180,180',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => $validator->errors()
        ], 422);
    }

    // Update latitude and longitude
    $user->latitude = $request->latitude;
    $user->longitude = $request->longitude;
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Location updated successfully',
        'data' => [
            'latitude' => $user->latitude,
            'longitude' => $user->longitude,
        ]
    ], 200);
}


public function getLocation($id)
{
    // Find the user by ID
    $user = User::find($id);

    // If user not found
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    // Return the latitude and longitude
    return response()->json([
        'success' => true,
        'message' => 'User location fetched successfully',
        'data' => [
            'latitude' => $user->latitude,
            'longitude' => $user->longitude,
        ]
    ], 200);
}

public function addElderToProfile(Request $request, $id)
{
    // Find the user by ID
    $user = User::find($id);
    $elder = User::where('id', $request->elder_id)
                 ->where('user_type', 'elder')
                 ->first();

    // If the user doesn't exist
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }

    if (!$elder) {
        return response()->json([
            'success' => false,
            'message' => 'Elder not found'
        ], 404);
    }

    $user->elder_id = $request->elder_id;
    $user->relation_to_elder = $request->relation_to_elder;
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Profile updated successfully',
      'user' => $user
    ], 200);
}


}