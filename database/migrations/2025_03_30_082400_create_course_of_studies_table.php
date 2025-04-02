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
        Schema::create('courses_of_study', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code', 20)->unique();
            $table->text('description')->nullable();
            $table->foreignId('department_id')->constrained()->onDelete('cascade'); // Assuming a departments table exists
            $table->integer('duration_years')->default(4);
            $table->enum('degree_type', ['BSc', 'BA', 'MSc', 'PhD', 'Diploma']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses_of_study');
    }
};
