<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'photo' => fake()->imageUrl(640, 480, 'people', true),
            'role' => fake()->randomElement(['admin', 'student', 'lecturer', 'course_rep', 'hod']),
            'staff_id' => fake()->unique()->numberBetween(1000, 9999),
            'matric_number' => fake()->unique()->numberBetween(100000, 999999),
            'level' => fake()->numberBetween(100, 500),
            'course_of_study_id' => fake()->numberBetween(1, 10), 
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
