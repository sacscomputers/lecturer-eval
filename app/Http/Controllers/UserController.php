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
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Redirect;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return Inertia::render('Auth/Users/Index', compact('users'));
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
        $request->validate([
            'file' => 'required|mimes:csv,txt',
        ]);

        $path = $request->file('file')->store('uploads', 'public');
        $fullPath = storage_path('app/public/' . $path);

        if (($handle = fopen($fullPath, 'r')) !== false) {
            $header = fgetcsv($handle); // Read the first line as headers

            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($header, $row); // Map CSV row to headers

                User::create([
                    'name' => $data['name'] ?? null,
                    'email' => $data['email'] ?? null,
                    'password' => $data['password'] ?? null, // Assuming it's a URL/path
                    'role' => $data['role'] ?? null,
                ]);
            }

            fclose($handle);
        }

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
