<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'course_id', 'lecturer_id', 'semester_id', 'academic_year_id', 
        'status', 'arrival_time', 'departure_time', 'recorded_by'
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function lecturer() {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function recordedBy() {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    public function academicYear() {
        return $this->belongsTo(AcademicYear::class, 'academic_year_id');
    }

    public function semester() {
        return $this->belongsTo(Semester::class, 'semester_id');
    }
}
