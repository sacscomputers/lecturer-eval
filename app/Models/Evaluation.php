<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{

    protected $fillable = [
        'course_id',
        'user_id',
        'metric_id',
        'lecturer_id',
        'rating',
        'semester_id',
        'academic_year_id',
        'created_at',
        'updated_at'
    ];

    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function lecturer()
    {
        return $this->belongsTo(User::class, 'lecturer_id');
    }

    public function metric()
    {
        return $this->belongsTo(Metric::class, 'metric_id');
    }
}
