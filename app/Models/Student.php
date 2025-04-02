<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('student', function ($query) {
            $query->where('role', 'student');
        });
    }

    // Relationships
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_student');
    }
}
