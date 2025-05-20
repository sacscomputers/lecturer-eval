<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();
        // $this->call([
        //     UserSeeder::class,
        //     DepartmentSeeder::class,
        //     CourseOfStudySeeder::class,
        //     AcademicYearSeeder::class,
        //     SemesterSeeder::class,
        //     MetricSeeder::class,
        //     CourseSeeder::class,
        //     CourseLecturerSeeder::class,
        //     CourseStudentSeeder::class,
        //     EvaluationSeeder::class,
        //     AttendanceSeeder::class,
        //     ScheduleSeeder::class,
        // ]);
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        // create all the roles
        $roles = ['admin', 'student', 'lecturer', 'course rep', 'hod'];
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        $user->assignRole('admin');
    }
}
