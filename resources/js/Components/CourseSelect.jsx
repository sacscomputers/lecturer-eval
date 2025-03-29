import React, { useState } from "react";
import AsyncSelect from "react-select/async";
import { useForm } from "@inertiajs/react";

export default function CourseSelect({ routeName, lecturerId }) {
    const { data, setData, post, processing } = useForm({
        lecturer_id: lecturerId,
        course_ids: [],
    });
    const [selectedCourses, setSelectedCourses] = useState([]);

    // Fetch courses from the backend
    const loadOptions = async (inputValue) => {
        const response = await fetch(route(routeName, { search: inputValue }));
        const courses = await response.json();
        return courses.map((course) => ({
            value: course.id,
            label: `${course.code} - ${course.title}`,
        }));
    };

    // Handle selection change
    const handleChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions);
        setData(
            "course_ids",
            selectedOptions.map((option) => option.value)
        );
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("lecturer.assign-courses", { lecturer: data.lecturer_id }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="w-full">
                {/* Select Courses */}
                <div className="">
                    <label
                        htmlFor="courses"
                        className="text-sm font-medium text-gray-700"
                    >
                        Select Courses
                    </label>
                    <AsyncSelect
                        id="courses"
                        isMulti
                        cacheOptions
                        defaultOptions
                        loadOptions={loadOptions}
                        onChange={handleChange}
                        value={selectedCourses}
                        className="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={processing}
                >
                    Assign Courses
                </button>
            </form>
        </div>
    );
}
