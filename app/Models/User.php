<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'photo',
        'matric_number',
        'staff_id',
        'level',
        'course_of_study_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $appends = ['role_names'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function coursesAsLecturer()
    {
        return $this->belongsToMany(Course::class, 'course_lecturer')->withPivot('semester_id', 'academic_year_id');
    }

    public function coursesAsStudent()
    {
        return $this->belongsToMany(Course::class, 'course_student');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class,);
    }

    // course of study
    public function courseOfStudy()
    {
        return $this->belongsTo(CourseOfStudy::class, 'course_of_study_id');
    }

    public function getRoleNamesAttribute()
    {
        return $this->getRoleNames(); // Returns a collection of role names
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'lecturer_id');
    }
}
