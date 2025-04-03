<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    protected $fillable = ['name', 'academic_year_id', 'start_date', 'end_date'];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
