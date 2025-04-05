<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Schedule;
use App\Models\Semester;
use App\Models\AcademicYear;
use App\Http\Requests\StoreScheduleRequest;
use App\Http\Requests\UpdateScheduleRequest;

class ScheduleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $schedules = Schedule::with(['course', 'lecturer', 'semester'])->get();
        $courses = Course::all();
        $semesters = Semester::all();
        $lecturers = User::where('role', 'lecturer')->get();
        $venues = Schedule::distinct()->pluck('venue');
        $academicYears = AcademicYear::all();

        return inertia('Auth/Schedules/Index', [
            'schedules' => $schedules,
            'courses' => $courses,
            'semesters' => $semesters,
            'lecturers' => $lecturers,
            'venues' => $venues,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $courses = Course::all();
        $semesters = Semester::all();
        $lecturers = User::where('role', 'lecturer')->get();
        $academicYears = AcademicYear::all();

        return inertia('Auth/Schedules/Create', [
            'courses' => $courses,
            'semesters' => $semesters,
            'lecturers' => $lecturers,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreScheduleRequest $request)
    {
        $validatedData = $request->validated();

        Schedule::create($validatedData);

        return redirect()->route('schedules.index')->with('success', 'Schedule created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Schedule $schedule)
    {
        $schedule->load(['course', 'lecturer', 'semester', 'academicYear']);

        return inertia('Auth/Schedules/Show', [
            'schedule' => $schedule,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Schedule $schedule)
    {
        $schedule->load(['course', 'lecturer', 'semester']);
        $courses = Course::all();
        $semesters = Semester::all();
        $lecturers = User::where('role', 'lecturer')->get();
        $academicYears = AcademicYear::all();

        return inertia('Auth/Schedules/Edit', [
            'courses' => $courses,
            'semesters' => $semesters,
            'lecturers' => $lecturers,
            'academicYears' => $academicYears,
            'schedule' => $schedule,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateScheduleRequest $request, Schedule $schedule)
    {
        $validatedData = $request->validated();

        $schedule->update($validatedData);

        return redirect()->route('schedules.show', $schedule->id)->with('success', 'Schedule updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Schedule $schedule)
    {
        $schedule->delete();
        return redirect()->route('schedules.index')->with('success', 'Schedule deleted successfully.');

    }
}
