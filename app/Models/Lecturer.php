<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    protected $table = 'users';

    protected static function booted()
    {
        static::addGlobalScope('lecturer', function ($query) {
            $query->where('role', 'lecturer');
        });
    }

    // Relationships
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_lecturer');
    }
}
