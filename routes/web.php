<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\MetricController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SemesterController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\AcademicYearController;
use App\Http\Controllers\CourseOfStudyController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // users
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    // search for student
    Route::get('/users/search', [UserController::class, 'searchStudents'])->name('students.search');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::post('/users/bulk-upload', [UserController::class, 'bulkUpload'])->name('users.bulk-upload');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::post('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');


    Route::post('lecturer/{lecturer}/courses', [CourseController::class, 'assignCourse'])->name('lecturer.assign-courses');
    // evaluate lecturer
    Route::get('lecturer/{lecturer}/course/{course}/evaluate', [CourseController::class, 'evaluateLecturerForm'])->name('lecturers.evaluate');
    Route::post('lecturer/{lecturer}/course/{course}/evaluate', [CourseController::class, 'evaluateLecturer'])->name('lecturers.evaluate');
    // unassign course from lecturer
    Route::delete('lecturer/{lecturer}/courses/{course}', [CourseController::class, 'unassignCourse'])->name('lecturer.unassign-course');
    
    // courses
    Route::get('lecturer/{lecturer}/courses', [CourseController::class, 'assign'])->name('courses.assign');
    Route::get('course/{course}/enroll', [CourseController::class, 'enroll'])->name('courses.enroll');
    Route::post('course/{course}/enroll', [CourseController::class, 'enrollStudents'])->name('courses.enroll-students');
    Route::post('course/{course}/student/{student}', [CourseController::class, 'unenrollStudents'])->name('courses.unenroll-students');
    Route::get('/courses/search', [CourseController::class, 'search'])->name('courses.search');
    Route::post('courses/{course}', [CourseController::class, 'update'])->name('courses.update');
    Route::resource('courses', CourseController::class)->names('courses');
    Route::post('/courses/bulk-upload', [CourseController::class, 'bulkUpload'])->name('courses.bulk-upload');
   
    // Academic year
    // Route::resource('academic-years', AcademicYearController::class)->names('academic_years');

    // departments
    Route::resource('departments', DepartmentController::class)->names('departments');


    // academic years
    Route::get('/academic-years', [AcademicYearController::class, 'index'])->name('academicYears.index');
    Route::get('/academic-years/create', [AcademicYearController::class, 'create'])->name('academicYears.create');
    Route::post('/academic-years', [AcademicYearController::class, 'store'])->name('academicYears.store');
    Route::get('/academic-years/{id}', [AcademicYearController::class, 'show'])->name('academicYears.show');
    Route::get('/academic-years/{id}/edit', [AcademicYearController::class, 'edit'])->name('academicYears.edit');
    Route::post('/academic-years/{id}', [AcademicYearController::class, 'update'])->name('academicYears.update');
    Route::delete('/academic-years/{id}', [AcademicYearController::class, 'destroy'])->name('academicYears.destroy');
    // semesters
    Route::resource('semesters', SemesterController::class)->names('semesters');

    // evaluations
    Route::get('/evaluations', [EvaluationController::class, 'index'])->name('evaluations.index');
    Route::patch('/evaluations/{evaluation}', [EvaluationController::class, 'update'])->name('evaluations.update');
    Route::get('/evaluations/{evaluation}', [EvaluationController::class, 'show'])->name('evaluations.show');
    Route::post('/evaluations', [EvaluationController::class, 'create'])->name('evaluations.update');
    Route::delete('/evaluations', [EvaluationController::class, 'destroy'])->name('evaluations.destroy');

    // evaluations
    Route::get('/attendance', [AttendanceController::class, 'index'])->name('attendance.index');
    Route::patch('/attendance/{attendance}', [AttendanceController::class, 'update'])->name('attendance.update');
    Route::get('/attendance/{attendance}', [AttendanceController::class, 'show'])->name('attendance.show');
    Route::post('/attendance', [AttendanceController::class, 'create'])->name('attendance.update');
    Route::delete('/attendance', [AttendanceController::class, 'destroy'])->name('attendance.destroy');

    // Metrics
    Route::resource('metrics', MetricController::class)->names('metrics');
    Route::get('/metrics/search', [MetricController::class, 'search'])->name('metrics.search');

    // CoursesOfStudy
    Route::resource('courses-of-study', CourseOfStudyController::class)->names('coursesOfStudy');
});


require __DIR__.'/auth.php';
