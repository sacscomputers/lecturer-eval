<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Semester;
use App\Models\AcademicYear;
use App\Http\Requests\StoreSemesterRequest;
use App\Http\Requests\UpdateSemesterRequest;

class SemesterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $semesters = Semester::all();
        return Inertia::render('Auth/Semesters/Index', compact('semesters'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $academicYears = AcademicYear::all();
        return Inertia::render('Auth/Semesters/Create', compact('academicYears'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSemesterRequest $request)
    {
        $validated = $request->validated();
        Semester::create($validated);
        return redirect()->route('semesters.index')->with('success', 'semester created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Semester $semester)
    {
        return Inertia::render('Auth/Semesters/Show', compact('semester'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Semester $semester)
    {
        $academicYears = AcademicYear::all();
        return Inertia::render('Auth/Semesters/Edit', compact('semester', 'academicYears'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSemesterRequest $request, Semester $semester)
    {
        $validated = $request->validated();
        $semester->update($validated);
        return redirect()->route('semesters.index')->with('success', 'semester created successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Semester $semester)
    {
        $semester->delete();
        return redirect()->route('semesters.index');
    }
}
