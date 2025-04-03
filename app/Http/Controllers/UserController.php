<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Metric;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use App\Models\CourseOfStudy;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('courseOfStudy')->get();
        $coursesOfStudy = CourseOfStudy::all();
        $levels = ["100", "200", "300", "400"];
        $roles = ['admin', 'student', 'lecturer', 'course_rep', 'hod'];
        return Inertia::render('Auth/Users/Index', compact('users', 'coursesOfStudy', 'levels', 'roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $coursesOfStudy = CourseOfStudy::all();
        return Inertia::render('Auth/Users/Create', compact('coursesOfStudy'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('users', 'public') : null;
        
        User::create($validatedData);

        return redirect(route('users.index', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $evaluations = Evaluation::where('lecturer_id', $user->id)->get();
        
        $metrics = Metric::all();
        $user->load('courseOfStudy');
        // dd($user);
        return Inertia::render('Auth/Users/Show', compact('user', 'metrics', 'evaluations'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $coursesOfStudy = CourseOfStudy::all();
        $user->load('courseOfStudy');
        return Inertia::render('Auth/Users/Edit', compact('user', 'coursesOfStudy'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $validatedData = $request->validated();
        // dd($validatedData);
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('users', 'public') : $user->photo;
        if ($request->role == 'student' || $request->role == 'course_rep') {
            $validatedData['role'] = 'student';
            $validatedData['matric_number'] = $request->matric_number;
            $validatedData['level'] = $request->level;
            $validatedData['course_of_study_id'] = $request->course_of_study_id;
        } else if ($request->role == 'lecturer' || $request->role == 'hod') {
            $validatedData['role'] = 'lecturer';
            $validatedData['staff_id'] = $request->staff_id;
        }
        $user->update($validatedData);

        return redirect(route('users.index', absolute: false));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return Redirect::to('/users');
    }

    /**
     * Bulk upload users.
     */
    public function bulkUpload(Request $request)
{
    // Validate file type
    $request->validate([
        'file' => 'required|mimes:csv,txt|max:2048',
    ]);

    // Store the file and get the path
    $path = $request->file('file')->store('uploads', 'public');
    $fullPath = storage_path('app/public/' . $path);

    // Open the file for reading
    if (($handle = fopen($fullPath, 'r')) !== false) {
        $header = fgetcsv($handle); // Read headers

        $users = [];

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row); // Map CSV row to headers

            // Validate each user entry
            $validator = Validator::make($data, [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8'], // Hash before saving
                'role' => ['required', 'string', 'in:student,lecturer'],
                'photo' => ['nullable', 'string'],
                'level' => ['nullable', 'required_if:role,student', 'integer', 'in:100,200,300,400,500,600,700'],
                'course_of_study_id' => ['nullable', 'required_if:role,student', 'exists:courses_of_study,id'],
                'matric_number' => ['nullable', 'required_if:role,student', 'string', 'max:20', 'unique:users,matric_number'],
                'staff_id' => ['nullable', 'required_if:role,lecturer', 'string', 'max:20', 'unique:users,staff_id'],
            ]);

            if ($validator->fails()) {
                fclose($handle);
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Prepare user data
            $users[] = [
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']), // Hashing password
                'role' => $data['role'],
                'photo' => $data['photo'] ?? null,
                'level' => $data['level'] ?? null,
                'course_of_study_id' => $data['course_of_study_id'] ?? null,
                'matric_number' => $data['matric_number'] ?? null,
                'staff_id' => $data['staff_id'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        fclose($handle);

        // Insert all users in a single query for better performance
        User::insert($users);
    }

    // Delete the uploaded file after processing
    Storage::disk('public')->delete($path);

    return redirect()->route('users.index')->with('success', 'Users uploaded successfully.');
}

    // assign Course to User
    public function assignCourse(Request $request, User $user)
    {
        // validate request contains array of course ids
        $request->validate([
            'course_ids' => 'required|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        // check if $user is a lecturer
        if (!$user->isLecturer()) {
            return redirect()->route('users.show', $user->id);
        }

        $user->coursesAsLecturer()->attach($request->course_ids);
        return redirect()->route('users.show', $user->id);
    }

    // search for students
    public function searchStudents(Request $request)
    {
        $query = $request->input('query');

        // Filter users by role 'student' and search by name or email
        $users = User::where('role', 'student')
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%$query%")
                  ->orWhere('email', 'like', "%$query%");
            })
            ->get();
    
        return response()->json($users);
    }
}
