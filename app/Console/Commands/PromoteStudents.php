<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class PromoteStudents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:promote-students';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::table('course_student')->truncate();
        \App\Models\User::with('courseOfStudy')
            ->where('status', 'active')
            ->where('matric_number', '!=', null)
            ->where('level', '!=', null)
            ->chunk(1000, function ($students) {
                foreach ($students as $student) {
                    // dd($student);
                    $currentLevel = $student->level;
                    $expectedFinalLevel = $student->courseOfStudy->duration_years * 100;

                    if ($currentLevel >= $expectedFinalLevel) {
                        $student->status = 'graduated';
                    } else {
                        $student->level += 100;
                    }

                    $student->save();
                }
            });

        $this->info('Student levels updated and graduates marked.');
    }
}
