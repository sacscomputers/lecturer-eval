import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Select from "react-select";
import { Head, useForm } from "@inertiajs/react";

export default function AssignCourses({ lecturer, courses, coursesAssigned, academicYears, semesters }) {
    const { data, setData, post, delete: destroy, processing } = useForm({
        course_ids: [],
        academic_year_id: "",
        semester_id: "",
    });
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [filteredSemesters, setFilteredSemesters] = useState([]);

    // Handle selection change for courses
    const handleCourseChange = (selectedOptions) => {
        setSelectedCourses(selectedOptions || []);
        setData(
            "course_ids",
            (selectedOptions || []).map((option) => option.value)
        );
    };

    // Handle selection change for academic year
    const handleAcademicYearChange = (selectedOption) => {
        setData("academic_year_id", selectedOption ? selectedOption.value : "");
        // Filter semesters based on the selected academic year
        const filtered = semesters.filter(
            (semester) => semester.academic_year_id === selectedOption.value
        );
        setFilteredSemesters(filtered);
        setData("semester_id", ""); // Reset semester selection
    };

    // Handle selection change for semester
    const handleSemesterChange = (selectedOption) => {
        setData("semester_id", selectedOption ? selectedOption.value : "");
    };

    // Handle form submission for assigning courses
    const handleAssign = (e) => {
        e.preventDefault();
        if (data.course_ids.length === 0 || !data.academic_year_id || !data.semester_id) {
            alert("Please select courses, an academic year, and a semester.");
            return;
        }
        post(route("lecturer.assign-courses", lecturer.id));
    };

    // Handle unassigning a course
    const handleUnassign = (course) => {
        destroy(route("lecturer.unassign-course", { lecturer: lecturer.id, course: course.id }));
    };

    // Map courses to options for react-select
    const courseOptions = courses.map((course) => ({
        value: course.id,
        label: `${course.title} (${course.code})`,
    }));

    // Map academic years to options for react-select
    const academicYearOptions = academicYears.map((year) => ({
        value: year.id,
        label: year.name,
    }));

    // Map semesters to options for react-select
    const semesterOptions = filteredSemesters.map((semester) => ({
        value: semester.id,
        label: semester.name,
    }));

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Assign Courses to {lecturer.name}
                </h2>
            }
        >
            <Head title="Assign Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Assign New Courses */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Assign New Courses
                        </h3>
                        <form onSubmit={handleAssign}>
                            {/* Academic Year Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Academic Year
                                </label>
                                <Select
                                    options={academicYearOptions}
                                    onChange={handleAcademicYearChange}
                                    className="mt-1"
                                />
                            </div>

                            {/* Semester Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Semester
                                </label>
                                <Select
                                    options={semesterOptions}
                                    onChange={handleSemesterChange}
                                    className="mt-1"
                                    isDisabled={!data.academic_year_id}
                                />
                            </div>

                            {/* Course Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Courses
                                </label>
                                <Select
                                    options={courseOptions}
                                    isMulti
                                    onChange={handleCourseChange}
                                    value={selectedCourses}
                                    className="mt-1"
                                />
                            </div>

                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                disabled={processing}
                            >
                                Assign Selected Courses
                            </button>
                        </form>
                    </div>

                    {/* Display Assigned Courses */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Assigned Courses
                        </h3>
                        {coursesAssigned.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {coursesAssigned.map((course) => (
                                        <tr key={course.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {course.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {course.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => handleUnassign(course)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Unassign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No courses assigned to this lecturer.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}