<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CourseOfStudy;

class Department extends Model
{
    protected $table = 'departments'; // Laravel will automatically assume 'departments', so this line is optional

    protected $fillable = [
        'name',
        'code',
        'description',
    ];
    /**
     * Relationship: A department has many courses.
     */
    public function courses()
    {
        return $this->hasMany(CourseOfStudy::class);
    }
}
