<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
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
        return $this->belongsToMany(Course::class, 'course_lecturer');
    }

    public function coursesAsStudent()
    {
        return $this->belongsToMany(Course::class, 'course_student');
    }

    public function isLecturer()
    {
        return $this->role === 'lecturer' || $this->role === 'hod';
    }

    public function isStudent()
    {
        return $this->role === 'student' || $this->role === 'course_rep';
    }

    public function isAdmin()
    {
        return $this->role === 'admin' || $this->role === 'hod';
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    // course of study
    public function courseOfStudy()
    {
        return $this->belongsTo(CourseOfStudy::class, 'course_of_study_id');
    }
}
