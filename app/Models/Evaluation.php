<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{

    protected $fillable = [
        'course_id',
        'student_id',
        'metric_id',
        'lecturer_id',
        'rating',
        'created_at',
        'updated_at'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }
}
