<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use SoftDeletes;
    protected $fillable = ['title', 'code', 'description', 'photo', 'department_id'];

    // relationships
    // students enrolled in the course
    public function students()
    {
        return $this->belongsToMany(User::class, 'course_student', 'course_id', 'user_id');
    }

    // lecturers teaching the course
    public function lecturers()
    {
        return $this->belongsToMany(User::class, 'course_lecturer', 'course_id', 'user_id');
    }

    // department offering the course
    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}


