import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Show({ courseOfStudy, department, lecturers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { delete: destroy } = useForm();

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("coursesOfStudy.destroy", courseOfStudy.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Course of Study Details
                </h2>
            }
        >
            <Head title="Course of Study Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("coursesOfStudy.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                                as="button"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Course of Study Details */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {courseOfStudy.name}
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    {/* Code */}
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Code
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {courseOfStudy.code}
                                        </dd>
                                    </div>

                                    {/* Department */}
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Department
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {courseOfStudy.department.name || "N/A"}
                                        </dd>
                                    </div>

                                    {/* Duration (Years) */}
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Duration (Years)
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {courseOfStudy.duration_years}
                                        </dd>
                                    </div>

                                    {/* Degree Type */}
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Degree Type
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {courseOfStudy.degree_type}
                                        </dd>
                                    </div>

                                    {/* Description */}
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Description
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {courseOfStudy.description || "N/A"}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end">
                            <Link
                                href={route("coursesOfStudy.edit", courseOfStudy.id)}
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
                        </div>
                    </div>

                    {/* Lecturers Teaching the Course */}
                    {lecturers && lecturers.length > 0 && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Lecturers
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <ul className="divide-y divide-gray-200">
                                    {lecturers.map((lecturer) => (
                                        <li
                                            key={lecturer.id}
                                            className="px-4 py-4 sm:px-6"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={`/storage/${lecturer.photo}`}
                                                    alt={lecturer.name}
                                                    className="h-12 w-12 rounded-full"
                                                />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                        {lecturer.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {lecturer.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p>
                            Are you sure you want to delete the course of study{" "}
                            <strong>{courseOfStudy.name}</strong>?
                        </p>
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