<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseOfStudyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:courses_of_study,name,' . $this->route('courses_of_study')->id,
            'code' => 'required|string|max:10|unique:courses_of_study,code,' . $this->route('courses_of_study')->id,
            'department_id' => 'required|exists:departments,id',
            'description' => 'nullable|string|max:1000',
            'duration_years' => 'required|integer|min:1|max:10',
            'degree_type' => 'required|in:BSc,BA,MSc,PhD,Diploma',
        ];
    }
}
