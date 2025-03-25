<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Course;
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
    public function index()
    {
        $courses = Course::all();
        
        return Inertia::render('Auth/Courses/Index', compact('courses'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Auth/Courses/Create');
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
    public function show(Course $course)
    {
        return Inertia::render('Auth/Courses/Show', compact('course'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Course $course)
    {
        return Inertia::render('Auth/Courses/Edit', compact('course'));
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
}
