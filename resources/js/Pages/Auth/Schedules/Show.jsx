import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";

export default function Show({ schedule }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { delete: destroy } = useForm();
    const user = usePage().props.auth.user;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("schedules.destroy", schedule.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Schedule Details
                </h2>
            }
        >
            <Head title="Schedule Details" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl bg-white p-6 rounded-lg shadow">
                    {/* Back Button */}
                    <div className="flex justify-end mb-4">
                        <Link
                            href={route("schedules.index")}
                            className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                        >
                            Back
                        </Link>
                    </div>

                    {/* Schedule Details */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                            <Link
                            href={route("courses.show", schedule.course.id)} className="hover:underline">{schedule.course.title}</Link>
                                
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Schedule Information
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Lecturer */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Lecturer
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <Link
                            href={route("users.show", schedule.lecturer.id)} className="hover:underline">{schedule.lecturer.name}</Link>
                                        
                                    </dd>
                                </div>

                                {/* Semester */}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Semester
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <Link
                                    href={route("semesters.show", schedule.semester.id)} className="hover:underline">{schedule.semester.name}</Link>
                                        
                                    </dd>
                                </div>

                                {/* Academic Year */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Academic Year
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <Link
                                    href={route("academicYears.show", schedule.academic_year.id)} className="hover:underline">{schedule.academic_year.name}</Link>
                                        
                                    </dd>
                                </div>

                                {/* Day of the Week */}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Day of the Week
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {schedule.day_of_week}
                                    </dd>
                                </div>

                                {/* Time */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Time
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {schedule.start_time} - {schedule.end_time}
                                    </dd>
                                </div>

                                {/* Venue */}
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        Venue
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {schedule.venue}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex justify-end">
                       { user.role_names.includes('admin') && (<>
                        <Link
                            href={route("schedules.edit", schedule.id)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={openModal}
                            className="text-red-600 hover:text-red-900"
                        >
                            Delete
                        </button>
                       </>)}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p>Are you sure you want to delete this schedule?</p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-900 mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="text-red-600 hover:text-red-900"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}