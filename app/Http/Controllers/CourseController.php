<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Metric;
use App\Models\Department;
use Illuminate\Http\Request;
use Dotenv\Store\File\Reader;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\StoreCourseRequest;
use App\Http\Requests\UpdateCourseRequest;

class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        
        // check if user is an admin
        if ($request->user()->isAdmin()) {
            $courses = Course::with('department')->get();
            return Inertia::render('Auth/Courses/Index', compact('courses'));
        }

        // check if user is a lecturer
        if ($request->user()->isLecturer()) {
           
            $courses = $request->user()->coursesAsLecturer()->get();
            return Inertia::render('Auth/Courses/Index', compact('courses'));
        }

        // check if user is a student
        if ($request->user()->isStudent()) {
            
            $courses = $request->user()->coursesAsStudent()->get();
            return Inertia::render('Auth/Courses/Index', compact('courses'));
        }

        // if user is not a lecturer or student, redirect to home
        return redirect()->route('dashboard')->with('error', 'You are not authorized to view this page.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();
        return Inertia::render('Auth/Courses/Create', compact('departments'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('courses', 'public') : null;
        Course::create($validatedData);

        return redirect(route('courses.index', absolute: false));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Course $course)
    {
        $lecturers = $course->lecturers()->get();
        $students = $course->students()->get();
        $user = $request->user();
        $department = $course->department;
    
        return Inertia::render('Auth/Courses/Show', compact('course', 'user', 'lecturers', 'students', 'department'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        $departments = Department::all();
        return Inertia::render('Auth/Courses/Edit', compact('course', 'departments'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseRequest $request, Course $course)
    {
        $validatedData = $request->validated();
       
        $validatedData['photo'] = $request->file('photo') ? $request->file('photo')->store('courses', 'public') : $course->photo;
        $course->update($validatedData);

        return redirect(route('courses.index', absolute: false));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Course $course)
    {
        $course->delete();

        return Redirect::to('/courses');
    }

    /**
     * Bulk upload courses.
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

                Course::create([
                    'title' => $data['title'] ?? null,
                    'code' => $data['code'] ?? null,
                    'photo' => $data['photo'] ?? null, // Assuming it's a URL/path
                    'description' => $data['description'] ?? null,
                ]);
            }

            fclose($handle);
        }

        return redirect()->route('courses.index')->with('success', 'Courses uploaded successfully.');
    }

    /** 
     * Get courses for a lecturer.
     */
    public function getLecturerCourses(User $lecturer)
    {
        $courses = $lecturer->coursesAsLecturer()->get();
        return Inertia::render('Auth/Courses/Index', compact('courses', 'lecturer'));
    }

    /**
     * Search for courses.
     */
    public function search(Request $request)
    {
        $courses = Course::where('title', 'like', '%' . $request->search . '%')
            ->orWhere('code', 'like', '%' . $request->search . '%')
            ->get();
        return response()->json($courses);
    }

    // show page for assigning courses to users
    public function assign(User $lecturer)
    {
        // dd($lecturer);
        if (!$lecturer->isLecturer()) {
            return Redirect::route('courses.index')->with('error', 'User is not a lecturer.');
        }
        $coursesAssigned = $lecturer->coursesAsLecturer()->get();
        $courses = Course::all();
        return Inertia::render('Auth/Courses/AssignCourses', compact('lecturer', 'courses', 'coursesAssigned'));
    }

    // assign Course to User

    public function assignCourse(Request $request, User $lecturer)
    {
        if (!$lecturer->isLecturer()) {
            return Redirect::route('courses.index')->with('error', 'User is not a lecturer.');
        }

        $request->validate([
            'course_ids' => 'required|array',
            'course_ids.*' => 'exists:courses,id',
        ]);

        // Get currently assigned course IDs
        $existingCourses = $lecturer->coursesAsLecturer()->pluck('courses.id')->toArray();

        // Filter out already assigned courses
        $newCourses = array_diff($request->course_ids, $existingCourses);

        if (empty($newCourses)) {
            return Redirect::route('courses.assign', ['lecturer' => $lecturer->id])
                ->with('info', 'No new courses were assigned.');
        }

        // Assign only new courses without removing existing ones
        $lecturer->coursesAsLecturer()->attach($newCourses);

        return Redirect::route('courses.assign', ['lecturer' => $lecturer->id])
            ->with('success', 'Courses assigned successfully.');
    }


    // unassign Course from User
    public function unassignCourse(User $lecturer, Course $course)
    {
        if (!$lecturer->isLecturer()) {
            return Redirect::route('courses.index')->with('error', 'User is not a lecturer.');
        }

        $lecturer->coursesAsLecturer()->detach($course->id);
        return Redirect::route('courses.assign', ['lecturer' => $lecturer->id])->with('success', 'Course unassigned successfully.');
    }

    // show page for enrolling students in course
    public function enroll(Course $course)
    {
        $students = User::where('role', 'student')->get();
        $studentsEnrolled = $course->students()->get();
        return Inertia::render('Auth/Courses/EnrollStudents', compact('course', 'students', 'studentsEnrolled'));
    }
    // enroll students in course
    public function enrollStudents(Request $request, Course $course)
    {
        $request->validate([
            'student_ids' => 'required|array',
            'student_ids.*' => 'exists:users,id',
        ]);
    
        // Get currently enrolled student IDs
        $existingStudents = $course->students()->pluck('users.id')->toArray();
    
        // Filter out already enrolled students
        $newStudents = array_diff($request->student_ids, $existingStudents);
    
        if (empty($newStudents)) {
            return back()->with('info', 'No new students were enrolled.');
        }
    
        // Enroll only new students
        $course->students()->attach($newStudents);
    
        return back()->with('success', 'Students enrolled successfully.');
    }
    
    // unenroll students from course
    public function unenrollStudents(Request $request, Course $course, User $student)
    {

        // check if $student is enrolled in course
        if (!$course->students()->where('user_id', $student->id)->exists()) {
            return Redirect::route('courses.show', ['course' => $course->id])->with('error', 'Student is not enrolled in this course.');
        }

        $course->students()->detach($student->id);
        return back()->with('success', 'Students unenrolled successfully.');
    }
    // get students in course
    public function getCourseStudents(Course $course)
    {
        $students = $course->students()->get();
        return Inertia::render('Auth/Courses/Students', compact('course', 'students'));
    }
    // get courses for a student
    public function getStudentCourses(User $student)
    {
        $courses = $student->courses()->get();
        return Inertia::render('Auth/Courses/StudentCourses', compact('student', 'courses'));
    }

    // get lecturers for a course
    public function getCourseLecturers(Course $course)
    {
        $lecturers = $course->lecturers()->get();
        return Inertia::render('Auth/Courses/Lecturers', compact('course', 'lecturers'));
    }

    // show evaluation form for lecturer
    public function evaluateLecturerForm(User $lecturer, Course $course)
    {
        $metrics = Metric::all();
        // $courses = $lecturer->coursesAsLecturer()->get();
        return Inertia::render('Auth/Users/Evaluate', compact('lecturer', 'course', 'metrics'));
    }

    // evaluate lecturer
    public function evaluateLecturer(Request $request, User $lecturer, Course $course)
    {
        // Check if the user is a student
        if (!$request->user()->isStudent()) {
            return Redirect::route('courses.index')->with('error', 'You are not authorized to evaluate this lecturer.');
        }

        // Check if the lecturer is assigned to the course
        if (!$lecturer->coursesAsLecturer()->where('course_id', $course->id)->exists()) {
            return Redirect::route('courses.index')->with('error', 'Lecturer is not assigned to this course.');
        }

        // Validate the request
        $request->validate([
            'scores' => 'required|array',
            'scores.*' => 'required|integer|min:1|max:5', // Assuming ratings are between 1 and 5
        ]);
        
        // Save evaluations for each metric
        foreach ($request->scores as $metricId => $rating) {
            // Check if the metric exists
            if (!Metric::find($metricId)) {
                return back()->with('error', 'Invalid metric ID.');
            }
            $lecturer->evaluations()->create([
                'course_id' => $course->id,
                'metric_id' => $metricId,
                'rating' => $rating,
                'user_id' => $request->user()->id, // The student who is evaluating
                'lecturer_id' => $lecturer->id,
            ]);
        }

        return Redirect::route('courses.show', $course->id)->with('success', 'Lecturer evaluated successfully.');
    }
}
