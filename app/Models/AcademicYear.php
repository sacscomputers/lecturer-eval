<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    protected $fillable = ['name', 'start_date', 'end_date'];

    public function semesters()
    {
        return $this->hasMany(Semester::class);
    }

    public function getCurrentSemester()
    {
        return $this->semesters()->where('start_date', '<=', now())->where('end_date', '>=', now())->first();
    }
    public function getCurrentSemesterName()
    {
        $currentSemester = $this->getCurrentSemester();
        return $currentSemester ? $currentSemester->name : null;
    }
    public function getCurrentSemesterId()
    {
        $currentSemester = $this->getCurrentSemester();
        return $currentSemester ? $currentSemester->id : null;
    }
    public function getCurrentSemesterStartDate()
    {
        $currentSemester = $this->getCurrentSemester();
        return $currentSemester ? $currentSemester->start_date : null;
    }
    public function getCurrentSemesterEndDate()
    {
        $currentSemester = $this->getCurrentSemester();
        return $currentSemester ? $currentSemester->end_date : null;
    }
    public function getCurrentSemesterDuration()
    {
        $currentSemester = $this->getCurrentSemester();
        return $currentSemester ? $currentSemester->start_date->diffInDays($currentSemester->end_date) : null;
    }
}
