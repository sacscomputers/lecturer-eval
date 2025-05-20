<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Metric extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'rating',
    ];

    protected $casts = [
        'rating' => 'float',
    ];

    public function getRouteKeyName()
    {
        return 'name';
    }
    // public function getTypeAttribute($value)
    // {
    //     return $value === 'hod' ? 'HOD' : 'Student';
    // }
    // public function setTypeAttribute($value)
    // {
    //     $this->attributes['type'] = $value === 'HOD' ? 'hod' : 'student';
    // }
}
