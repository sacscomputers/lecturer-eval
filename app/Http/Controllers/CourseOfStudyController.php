<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\CourseOfStudy;
use App\Http\Requests\StoreCourseOfStudyRequest;
use App\Http\Requests\UpdateCourseOfStudyRequest;

class CourseOfStudyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $coursesOfStudy = CourseOfStudy::with('department')->get();
        
        return inertia('Auth/CoursesOfStudy/Index', [
            'coursesOfStudy' => $coursesOfStudy,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $departments = Department::all();

        return inertia('Auth/CoursesOfStudy/Create', [
            'departments' => $departments,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCourseOfStudyRequest $request)
    {
        $validated = $request->validated();

        CourseOfStudy::create($validated);

        return redirect()->route('coursesOfStudy.index')->with('success', 'Course of Study created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(CourseOfStudy $courses_of_study)
    {
        // get the course of study with its department
        $courses_of_study->load('department');
        
        return inertia('Auth/CoursesOfStudy/Show', [
            'courseOfStudy' => $courses_of_study,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CourseOfStudy $courses_of_study)
    {
        // get the course of study with its department
        $courseOfStudy = $courses_of_study->load('department');
        $departments = Department::all();

        return inertia('Auth/CoursesOfStudy/Edit', [
            'courseOfStudy' => $courses_of_study,
            'departments' => $departments,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCourseOfStudyRequest $request, CourseOfStudy $courses_of_study)
    {
        $validated = $request->validated();

        $courses_of_study->update($validated);

        return redirect()->route('coursesOfStudy.index')->with('success', 'Course of Study updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CourseOfStudy $courseOfStudy)
    {
        $courseOfStudy->delete();

        return redirect()->route('coursesOfStudy.index')->with('success', 'Course of Study deleted successfully');
    }
}
