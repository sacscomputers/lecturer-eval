<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\AcademicYear;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Fetch all academic years from the database
        $academicYears = AcademicYear::all();

        // Return the view with the list of academic years
        return Inertia::render('Auth/AcademicYears/Index', [
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Return the view for creating a new academic year
        return Inertia::render('Auth/AcademicYears/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Create a new academic year
        AcademicYear::create($request->all());

        // Redirect to the index page with a success message
        return redirect()->route('academicYears.index')->with('success', 'Academic Year created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Fetch the academic year by ID
        $academicYear = AcademicYear::findOrFail($id);

        // Return the view with the academic year details
        return Inertia::render('Auth/AcademicYears/Show', [
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        // Fetch the academic year by ID
        $academicYear = AcademicYear::findOrFail($id);

        // Return the view for editing the academic year
        return Inertia::render('Auth/AcademicYears/Edit', [
            'academicYear' => $academicYear,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        // Fetch the academic year by ID
        $academicYear = AcademicYear::findOrFail($id);

        // Update the academic year
        $academicYear->update($request->all());

        // Redirect to the index page with a success message
        return redirect()->route('academicYears.index')->with('success', 'Academic Year updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Fetch the academic year by ID
        $academicYear = AcademicYear::findOrFail($id);

        // Delete the academic year
        $academicYear->delete();

        // Redirect to the index page with a success message
        return redirect()->route('academicYears.index')->with('success', 'Academic Year deleted successfully.');
    }
}
