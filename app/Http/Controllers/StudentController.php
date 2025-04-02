<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $students = Student::with('courses', 'department')->get();
        
        return inertia('Auth/Students/Index', compact('students'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Auth/Students/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Handle storing the student data
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return inertia('Auth/Students/Show');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        return inertia('Auth/Students/Edit');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Handle updating the student data
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        // Handle deleting the student data
    }
}
