<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseOfStudy extends Model
{
    protected $table = 'courses_of_study';
    protected $fillable = [
        'name',
        'code',
        'description',
        'department_id',
        'duration_years',
        'degree_type'
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    // user
    public function students() {
        return $this->hasMany(User::class, 'course_of_study_id');
    }
}
