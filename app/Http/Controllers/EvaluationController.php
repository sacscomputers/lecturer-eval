<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Metric;
use App\Models\Student;
use App\Models\Lecturer;
use App\Models\Semester;
use App\Models\Evaluation;
use App\Models\AcademicYear;
use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;

class EvaluationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $evaluations = Evaluation::with(['course', 'student', 'lecturer', 'metric'])->get();
       
        $semesters = Semester::with('academicYear')->get();
        $academicYears = AcademicYear::all();
        $courses = Course::all();
        $students = User::role('student')->get();
        $lecturers = User::role('lecturer')->get();
        $metrics = Metric::all();
        return inertia('Auth/Evaluations/Index', compact('evaluations', 'semesters', 'academicYears', 'courses', 'students', 'lecturers', 'metrics'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEvaluationRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Evaluation $evaluation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Evaluation $evaluation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEvaluationRequest $request, Evaluation $evaluation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Evaluation $evaluation)
    {
        //
    }
}
