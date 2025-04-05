<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\Attendance;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendances = Attendance::with(['course', 'lecturer', 'recordedBy', 'semester', 'academicYear'])->get();
        return inertia('Auth/Attendance/Index', [
            'attendances' => $attendances,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $courses = Course::all();
        // dd($courses);
        $lecturers = User::where('role', 'lecturer')->get();
        $semesters = Semester::all();
        $academicYears = AcademicYear::all();

        return inertia('Auth/Attendance/Create', [
            'courses' => $courses,
            'lecturers' => $lecturers,
            'semesters' => $semesters,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'course_id' => 'required|exists:courses,id',
        'lecturer_id' => 'required|exists:users,id',
        'semester_id' => 'required|exists:semesters,id',
        'academic_year_id' => 'required|exists:academic_years,id',
        'status' => 'required|in:Present,Absent',
        'arrival_time' => 'nullable|date_format:H:i',
        'departure_time' => 'nullable|date_format:H:i|after:arrival_time',
    ]);

    
    // Get the schedule for that lecturer and course
    $schedule = Schedule::where('course_id', $request->course_id)
        ->where('lecturer_id', $request->lecturer_id)
        ->where('semester_id', $request->semester_id)
        ->where('academic_year_id', $request->academic_year_id)->first();
        // ->where('day_of_week', now()->format('l')) // Match today's weekday
        // ->first();

    if (!$schedule) {
        return back()->with('error', 'No schedule found for this course today.');
    }


    // Save attendance record
    Attendance::create([
        'course_id' => $request->course_id,
        'lecturer_id' => $request->lecturer_id,
        'semester_id' => $request->semester_id,
        'academic_year_id' => $request->academic_year_id,
        'status' => $request->status , 
        'arrival_time' => $request->arrival_time,
        'departure_time' => $request->departure_time,
        'recorded_by' => $request->user()->id,
    ]);

    return redirect()->route('attendance.index')->with('success', 'Attendance recorded successfully.');
}


    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }
}
