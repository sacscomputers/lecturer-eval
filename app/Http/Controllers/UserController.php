<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Metric;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Attendance;
use App\Models\Department;
use App\Models\Evaluation;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use App\Models\CourseOfStudy;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
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
        $roles = Role::all()->pluck('name');
        return Inertia::render('Auth/Users/Index', compact('users', 'coursesOfStudy', 'levels', 'roles'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $coursesOfStudy = CourseOfStudy::all();
        $roles = Role::all()->pluck('name');
        return Inertia::render('Auth/Users/Create', compact('coursesOfStudy', 'roles'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('users', 'public') : null;

        $user = User::create($validatedData);
        if ($request->has('roles')) {
            $user->syncRoles($validatedData['roles']);
        }

        return redirect(route('users.index', absolute: false))->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // dd($user);
        $evaluations = Evaluation::where('lecturer_id', $user->id)->get();
        $attendancesQuery = Attendance::where('lecturer_id', $user->id);

        $present = (clone $attendancesQuery)->where('status', 'present')->count();
        $absent = (clone $attendancesQuery)->where('status', 'absent')->count();
        $total = (clone $attendancesQuery)->count();

        $attendances = [
            'present' => $present,
            'absent' => $absent,
            'total' => $total,
        ];

        $metrics = Metric::all();
        $user->load('courseOfStudy');
        // dd($user);
        return Inertia::render('Auth/Users/Show', compact('user', 'metrics', 'evaluations', 'attendances'));
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

        // Handle photo upload
        $validatedData['photo'] = $request->file('photo')
            ? $request->file('photo')->store('users', 'public')
            : $user->photo;

        // Sync roles
        if ($request->has('roles')) {
            $user->syncRoles($validatedData['roles']); // Sync multiple roles
        }

        // Handle additional fields for specific roles
        if (in_array('student', $validatedData['roles']) || in_array('course_rep', $validatedData['roles'])) {
            $validatedData['matric_number'] = $request->matric_number;
            $validatedData['level'] = $request->level;
            $validatedData['course_of_study_id'] = $request->course_of_study_id;
        }

        if (in_array('lecturer', $validatedData['roles']) || in_array('hod', $validatedData['roles'])) {
            $validatedData['staff_id'] = $request->staff_id;
        }

        // Update user
        $user->update($validatedData);

        return redirect(route('users.index'))->with('success', 'User updated successfully.');
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
            'file' => 'required|mimes:csv,txt|max:2048',
        ]);

        $path = $request->file('file')->store('uploads', 'public');
        $fullPath = storage_path('app/public/' . $path);

        $usersData = [];
        $csvUserRoles = []; // email => role

        if (($handle = fopen($fullPath, 'r')) !== false) {
            $header = fgetcsv($handle);

            while (($row = fgetcsv($handle)) !== false) {
                $data = array_combine($header, $row);

                $validator = Validator::make($data, [
                    'name' => ['required', 'string', 'max:255'],
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                    'password' => ['required', 'string', 'min:8'],
                    'role' => ['required', 'string', 'in:student,lecturer,hod,course rep,admin'],
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

                $usersData[] = [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make($data['password']),
                    'photo' => $data['photo'] ?? null,
                    'course_of_study_id' => $data['course_of_study_id'] !== '' ? $data['course_of_study_id'] : null,
                    'level' => $data['level'] !== '' ? $data['level'] : null,
                    'matric_number' => $data['matric_number'] !== '' ? $data['matric_number'] : null,
                    'staff_id' => $data['staff_id'] !== '' ? $data['staff_id'] : null,
                ];

                $csvUserRoles[$data['email']] = $data['role'];
            }

            fclose($handle);
        }

        // Insert users
        User::insert($usersData);

        // Get inserted users by email
        $emails = array_column($usersData, 'email');
        $insertedUsers = User::whereIn('email', $emails)->get();

        // Fetch all roles just once
        $rolesMap = Role::whereIn('name', array_unique(array_values($csvUserRoles)))
            ->pluck('id', 'name');

        // Prepare pivot inserts
        $roleAssignments = [];

        foreach ($insertedUsers as $user) {
            $roleName = $csvUserRoles[$user->email];
            $roleId = $rolesMap[$roleName] ?? null;

            if ($roleId) {
                $roleAssignments[] = [
                    'role_id' => $roleId,
                    'model_type' => User::class,
                    'model_id' => $user->id,
                ];
            }
        }

        // Bulk insert into pivot table
        DB::table('model_has_roles')->insert($roleAssignments);

        Storage::disk('public')->delete($path);

        return redirect()->route('users.index')->with('success', 'Users uploaded and roles assigned successfully.');
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
        return redirect()->route('users.show', $user->id)->with('success', 'Courses assigned successfully.');
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

    public function dashboard(Request $request)
    {
        $summary = [
            'users' => User::count(),
            'courses' => Course::count(),
            'lecturers' => User::role('lecturer')->count(),
            'students' => User::role('student')->count(),
            'departments' => Department::count(),
            'schedules' => Schedule::count(),
            'attendances' => Attendance::count(),
            'evaluations' => Evaluation::count(),
        ];

        return Inertia::render('Dashboard', ['summary' => $summary]);
    }
}
