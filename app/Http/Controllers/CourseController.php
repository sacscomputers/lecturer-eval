<?php

namespace App\Http\Controllers;

use DB;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Course;
use App\Models\Metric;
use App\Models\Semester;
use App\Models\Department;
use App\Models\Evaluation;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use App\Models\CourseOfStudy;
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
           
            $courses = $request->user()->coursesAsLecturer()->with('department')->get();
            return Inertia::render('Auth/Courses/Index', compact('courses'));
        }

        // check if user is a student
        if ($request->user()->isStudent()) {
            
            $courses = $request->user()->coursesAsStudent()->with('department')->get();
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
        $department = $course->department();
    
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
        
        if (!$lecturer->isLecturer()) {
            return Redirect::route('courses.index')->with('error', 'User is not a lecturer.');
        } else {
            $coursesAssigned = $lecturer->coursesAsLecturer()->get();
            $semesters = Semester::all();
            $academicYears = AcademicYear::all();
            $courses = Course::all();
            return Inertia::render('Auth/Courses/AssignCourses', compact('lecturer', 'courses', 'coursesAssigned', 'academicYears', 'semesters'));
        }
        
    }

    // assign Course to User
    public function assignCourse(Request $request, User $lecturer)
    {
        // Ensure the user is a lecturer
        if (!$lecturer->isLecturer()) {
            return Redirect::route('courses.index')->with('error', 'User is not a lecturer.');
        }
    
        // Validate the request
        $request->validate([
            'course_ids' => 'required|array|min:1',
            'course_ids.*' => 'exists:courses,id',
            'semester_id' => 'required|exists:semesters,id',
            'academic_year_id' => 'required|exists:academic_years,id',
        ]);
    
        // Get the currently assigned courses for the lecturer in the specified semester and academic year
        $existingCourses = $lecturer->coursesAsLecturer()
            ->wherePivot('semester_id', $request->semester_id)
            ->wherePivot('academic_year_id', $request->academic_year_id)
            ->pluck('courses.id')
            ->toArray();
    
        // Filter out already assigned courses
        $newCourses = array_diff($request->course_ids, $existingCourses);
    
        if (empty($newCourses)) {
            return Redirect::route('courses.assign', ['lecturer' => $lecturer->id])
                ->with('info', 'No new courses were assigned.');
        }
    
        // Prepare data for attaching courses with additional metadata
        $attachData = [];
        foreach ($newCourses as $courseId) {
            $attachData[$courseId] = [
                'semester_id' => $request->semester_id,
                'academic_year_id' => $request->academic_year_id,
            ];
        }
    
        // Assign the new courses to the lecturer
        $lecturer->coursesAsLecturer()->attach($attachData);
    
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
        $academicYears = AcademicYear::all();
        $semesters = Semester::all();
        $levels = ['100', '200', '300', '400', '500'];
        $students = User::where('role', 'student')->orWhere('role', 'course_rep')->get();
        $studentsEnrolled = $course->students()->get();
        $coursesOfStudy = CourseOfStudy::all();
        return Inertia::render('Auth/Courses/EnrollStudents', compact('course', 'students', 'studentsEnrolled', 'levels', 'coursesOfStudy', 'academicYears', 'semesters'));
    }
    // enroll students in course
    
    public function enrollStudents(Request $request, Course $course)
    {
        // Validate the request
        $request->validate([
            'student_ids' => 'required_without_all:level,course_of_study_id|array|min:1',
            'student_ids.*' => 'exists:users,id',
            'level' => 'nullable|string|in:100,200,300,400,500',
            'course_of_study_id' => 'nullable|exists:courses_of_study,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'semester_id' => 'required|exists:semesters,id',
        ]);
    
        $newStudents = [];
    
        // If student_ids are provided, use them
        if ($request->filled('student_ids')) {
            // Get currently enrolled student IDs for the specified academic year and semester
            $existingStudents = $course->students()
                ->wherePivot('academic_year_id', $request->academic_year_id)
                ->wherePivot('semester_id', $request->semester_id)
                ->pluck('users.id')
                ->toArray();
    
            // Filter out already enrolled students
            $newStudents = array_diff($request->student_ids, $existingStudents);
        }
    
        // If level and course_of_study_id are provided, filter students
        if ($request->filled('level') && $request->filled('course_of_study_id')) {
            $filteredStudents = User::where('role', 'student')
                ->where('level', $request->level)
                ->where('course_of_study_id', $request->course_of_study_id)
                ->pluck('id')
                ->toArray();
    
            // Get currently enrolled student IDs for the specified academic year and semester
            $existingStudents = $course->students()
                ->wherePivot('academic_year_id', $request->academic_year_id)
                ->wherePivot('semester_id', $request->semester_id)
                ->pluck('users.id')
                ->toArray();
    
            // Filter out already enrolled students
            $newStudents = array_merge(
                $newStudents,
                array_diff($filteredStudents, $existingStudents)
            );
        }
    
        if (empty($newStudents)) {
            return back()->with('info', 'No new students were enrolled.');
        }
    
        // Enroll only new students with academic year and semester
        $attachData = [];
        foreach ($newStudents as $studentId) {
            $attachData[$studentId] = [
                'academic_year_id' => $request->academic_year_id,
                'semester_id' => $request->semester_id,
            ];
        }
    
        $course->students()->attach($attachData);
    
        return Redirect::route('courses.show', $course->id)->with('success', 'Students enrolled successfully.');
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
 
public function evaluateLecturerForm(Request $request, User $lecturer, Course $course)
{
    $metrics = Metric::all();

    // Check if the user is a student
    if (!$request->user()->isStudent()) {
        return Redirect::route('courses.index')->with('error', 'You are not authorized to evaluate this lecturer.');
    }

    // Check if the lecturer is assigned to the course
    $lecturerCourse = $lecturer->coursesAsLecturer()
        ->wherePivot('course_id', $course->id)
        ->first();

    if (!$lecturerCourse) {
        return Redirect::route('courses.index')->with('error', 'Lecturer is not assigned to this course.');
    }

    // Retrieve semester_id and academic_year_id from the pivot table
    $semesterId = $lecturerCourse->pivot->semester_id ?? null;
    $academicYearId = $lecturerCourse->pivot->academic_year_id ?? null;

    if (!$semesterId || !$academicYearId) {
        return Redirect::route('courses.index')->with('error', 'Semester or Academic Year information is missing.');
    }

    // Check if the user has already evaluated this lecturer for the same course and semester
    $existingEvaluation = Evaluation::where('course_id', $course->id)
    ->where('user_id', $request->user()->id)
    ->where('lecturer_id', $lecturer->id)
    ->where('semester_id', $semesterId)
    ->where('academic_year_id', $academicYearId)
    ->exists();
    
    if ($existingEvaluation) {
        // dd('I already evaluated this lecturer');
        return Redirect::route('courses.show', $course->id)
            ->with('info', 'You have already evaluated this lecturer for this course and semester.');
    }

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
        $lecturerCourse = $lecturer->coursesAsLecturer()
            ->wherePivot('course_id', $course->id)
            ->first();
    
        if (!$lecturerCourse) {
            return Redirect::route('courses.index')->with('error', 'Lecturer is not assigned to this course.');
        }
    
        // Retrieve semester_id and academic_year_id from the pivot table
        $semesterId = $lecturerCourse->pivot->semester_id ?? null;
        $academicYearId = $lecturerCourse->pivot->academic_year_id ?? null;
        
        if (!$semesterId || !$academicYearId) {
           
            return Redirect::route('courses.index')->with('error', 'Semester or Academic Year information is missing.');
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
            
            Evaluation::create([
                'course_id' => $course->id,
                'metric_id' => $metricId,
                'rating' => $rating,
                'user_id' => $request->user()->id, 
                'lecturer_id' => $lecturer->id,
                'semester_id' => $semesterId,
                'academic_year_id' => $academicYearId,
            ]);
        }
    
        return Redirect::route('courses.show', $course->id)->with('success', 'Lecturer evaluated successfully.');
    }
}
