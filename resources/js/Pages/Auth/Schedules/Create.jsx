import React, { useState } from "react";
import { useForm, Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ courses, lecturers, semesters, academicYears }) {
    const { data, setData, post, processing, errors } = useForm({
        course_id: "",
        lecturer_id: "",
        semester_id: "",
        academic_year_id: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        venue: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("schedules.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Schedule
                </h2>
            }
        >
            <Head title="Create Schedule" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl bg-white p-6 rounded-lg shadow">
                    <form onSubmit={handleSubmit}>
                        {/* Course */}
                        <div className="mb-4">
                            <label
                                htmlFor="course_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Course
                            </label>
                            <select
                                id="course_id"
                                value={data.course_id}
                                onChange={(e) => setData("course_id", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {errors.course_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.course_id}</p>
                            )}
                        </div>

                        {/* Lecturer */}
                        <div className="mb-4">
                            <label
                                htmlFor="lecturer_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Lecturer
                            </label>
                            <select
                                id="lecturer_id"
                                value={data.lecturer_id}
                                onChange={(e) => setData("lecturer_id", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a lecturer</option>
                                {lecturers.map((lecturer) => (
                                    <option key={lecturer.id} value={lecturer.id}>
                                        {lecturer.name}
                                    </option>
                                ))}
                            </select>
                            {errors.lecturer_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.lecturer_id}</p>
                            )}
                        </div>

                        {/* Semester */}
                        <div className="mb-4">
                            <label
                                htmlFor="semester_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Semester
                            </label>
                            <select
                                id="semester_id"
                                value={data.semester_id}
                                onChange={(e) => setData("semester_id", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                        {semester.name}
                                    </option>
                                ))}
                            </select>
                            {errors.semester_id && (
                                <p className="mt-2 text-sm text-red-600">{errors.semester_id}</p>
                            )}
                        </div>

                        {/* Academic Year */}
                        <div className="mb-4">
                            <label
                                htmlFor="academic_year_id"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Academic Year
                            </label>
                            <select
                                id="academic_year_id"
                                value={data.academic_year_id}
                                onChange={(e) => setData("academic_year_id", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select an academic year</option>
                                {academicYears.map((year) => (
                                    <option key={year.id} value={year.id}>
                                        {year.name}
                                    </option>
                                ))}
                            </select>
                            {errors.academic_year_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.academic_year_id}
                                </p>
                            )}
                        </div>

                        {/* Day of the Week */}
                        <div className="mb-4">
                            <label
                                htmlFor="day_of_week"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Day of the Week
                            </label>
                            <select
                                id="day_of_week"
                                value={data.day_of_week}
                                onChange={(e) => setData("day_of_week", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="">Select a day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                            {errors.day_of_week && (
                                <p className="mt-2 text-sm text-red-600">{errors.day_of_week}</p>
                            )}
                        </div>

                        {/* Start Time */}
                        <div className="mb-4">
                            <label
                                htmlFor="start_time"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Start Time
                            </label>
                            <input
                                type="time"
                                id="start_time"
                                value={data.start_time}
                                onChange={(e) => setData("start_time", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.start_time && (
                                <p className="mt-2 text-sm text-red-600">{errors.start_time}</p>
                            )}
                        </div>

                        {/* End Time */}
                        <div className="mb-4">
                            <label
                                htmlFor="end_time"
                                className="block text-sm font-medium text-gray-700"
                            >
                                End Time
                            </label>
                            <input
                                type="time"
                                id="end_time"
                                value={data.end_time}
                                onChange={(e) => setData("end_time", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.end_time && (
                                <p className="mt-2 text-sm text-red-600">{errors.end_time}</p>
                            )}
                        </div>

                        {/* Venue */}
                        <div className="mb-4">
                            <label
                                htmlFor="venue"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Venue
                            </label>
                            <input
                                type="text"
                                id="venue"
                                value={data.venue}
                                onChange={(e) => setData("venue", e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                            {errors.venue && (
                                <p className="mt-2 text-sm text-red-600">{errors.venue}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                disabled={processing}
                            >
                                Create Schedule
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}