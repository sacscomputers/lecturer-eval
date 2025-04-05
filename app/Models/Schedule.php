<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'course_id', 'lecturer_id', 'semester_id', 'academic_year_id',
        'day_of_week', 'start_time', 'end_time', 'venue'
    ];

    public function course() {
        return $this->belongsTo(Course::class);
    }

    public function lecturer() {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function semester() {
        return $this->belongsTo(Semester::class);
    }
    
    public function academicYear() {
        return $this->belongsTo(AcademicYear::class);
    }
}
