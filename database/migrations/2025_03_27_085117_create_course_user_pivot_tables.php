<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Pivot table for lecturers (users teaching courses)
    Schema::create('course_lecturer', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Lecturer
        $table->foreignId('course_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });

    // Pivot table for students (users enrolling in courses)
    Schema::create('course_student', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Student
        $table->foreignId('course_id')->constrained()->onDelete('cascade');
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_lecturer');
        Schema::dropIfExists('course_student');
    }
};
