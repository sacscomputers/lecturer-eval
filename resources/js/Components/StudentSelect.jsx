import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useForm } from "@inertiajs/react";

export default function StudentSelect({ routeName, courseId }) {
    const { data, setData, post, processing } = useForm({
        course_id: courseId,
        student_ids: [],
    });
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Fetch students from the backend
    const loadOptions = async (inputValue) => {
        const response = await fetch(route(routeName, { search: inputValue }));
        const students = await response.json();
        return students.map((student) => ({
            value: student.id,
            label: `${student.name} (${student.email})`,
        }));
    };

    // Handle selection change
    const handleChange = (selectedOptions) => {
        setSelectedStudents(selectedOptions);
        setData(
            "student_ids",
            selectedOptions.map((option) => option.value)
        );
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("courses.enroll-students", { course: data.course_id }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full">
                {/* Select Students */}
                <div>
                    <label
                        htmlFor="students"
                        className="text-sm font-medium text-gray-700"
                    >
                        Select Students
                    </label>
                    <AsyncSelect
                        id="students"
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        onChange={handleChange}
                        value={selectedStudents}
                        className="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={processing}
                >
                    Enroll Students
                </button>
            </form>
        </div>
    );
}