import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

const Create = ({ courses, lecturers, semesters, academicYears }) => {
    const { data, setData, post, processing, errors } = useForm({
        course_id: '',
        lecturer_id: '',
        semester_id: '',
        academic_year_id: '',
        status: '',
        arrival_time: '',
        departure_time: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('attendance.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Record Attendance
                </h2>
            }
        >
            <Head title="Record Attendance" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route('attendance.index')}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Attendance Form */}
                        <form onSubmit={handleSubmit}>
                            {/* Course Selection */}
                            <div>
                                <InputLabel htmlFor="course_id" value="Course" />
                                <select
                                    id="course_id"
                                    name="course_id"
                                    value={data.course_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) => setData('course_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.course_id} className="mt-2" />
                            </div>

                            {/* Lecturer Selection */}
                            <div className="mt-4">
                                <InputLabel htmlFor="lecturer_id" value="Lecturer" />
                                <select
                                    id="lecturer_id"
                                    name="lecturer_id"
                                    value={data.lecturer_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) => setData('lecturer_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a lecturer</option>
                                    {lecturers.map((lecturer) => (
                                        <option key={lecturer.id} value={lecturer.id}>
                                            {lecturer.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.lecturer_id} className="mt-2" />
                            </div>

                            {/* Semester Selection */}
                            <div className="mt-4">
                                <InputLabel htmlFor="semester_id" value="Semester" />
                                <select
                                    id="semester_id"
                                    name="semester_id"
                                    value={data.semester_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) => setData('semester_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select a semester</option>
                                    {semesters.map((semester) => (
                                        <option key={semester.id} value={semester.id}>
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.semester_id} className="mt-2" />
                            </div>

                            {/* Academic Year Selection */}
                            <div className="mt-4">
                                <InputLabel htmlFor="academic_year_id" value="Academic Year" />
                                <select
                                    id="academic_year_id"
                                    name="academic_year_id"
                                    value={data.academic_year_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) => setData('academic_year_id', e.target.value)}
                                    required
                                >
                                    <option value="">Select an academic year</option>
                                    {academicYears.map((year) => (
                                        <option key={year.id} value={year.id}>
                                            {year.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.academic_year_id} className="mt-2" />
                            </div>

                            {/* Status Selection */}
                            <div className="mt-4">
                                <InputLabel htmlFor="status" value="Status" />
                                <select
                                    id="status"
                                    name="status"
                                    value={data.status}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="">Select status</option>
                                    <option value="Present">Present</option>
                                    <option value="Absent">Absent</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            {/* Arrival Time */}
                            <div className="mt-4">
                                <InputLabel htmlFor="arrival_time" value="Arrival Time" />
                                <TextInput
                                    id="arrival_time"
                                    type="time"
                                    name="arrival_time"
                                    value={data.arrival_time}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('arrival_time', e.target.value)}
                                />
                                <InputError message={errors.arrival_time} className="mt-2" />
                            </div>

                            {/* Departure Time */}
                            <div className="mt-4">
                                <InputLabel htmlFor="departure_time" value="Departure Time" />
                                <TextInput
                                    id="departure_time"
                                    type="time"
                                    name="departure_time"
                                    value={data.departure_time}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('departure_time', e.target.value)}
                                />
                                <InputError message={errors.departure_time} className="mt-2" />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton className="ms-4" disabled={processing}>
                                    Submit
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;