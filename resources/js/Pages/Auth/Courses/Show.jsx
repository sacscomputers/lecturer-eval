import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Show({ course, user, lecturers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { delete: destroy } = useForm();
    console.log(course);
    console.log(user);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("courses.destroy", course.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Course Details
                </h2>
            }
        >
            <Head title="Course Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("courses.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
                                as="button"
                            >
                                Back
                            </Link>
                        </div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {course.title}
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Photo
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <img
                                                src={course.photo}
                                                alt={course.title}
                                                className="h-48 w-full object-cover"
                                            />
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Code
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {course.code}
                                        </dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Description
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {course.description}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            { user && user.role === "hod" && (
                                <Link
                                    href={route("courses.enroll", course.id)}
                                    className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
                                    as="button"
                                >
                                    Enroll Students
                                </Link>
                            )}

                           
                            <Link
                                href={route("courses.edit", course.id)}
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

                    {/* display lecturers taking course in datatable */}
                    {  user && user.role == "student" && (
                                <>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Lecturers
                            </h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {lecturers.length > 0 ? (
                                    <DataTable 
                                        data={lecturers}
                                        columns={[
                                            {
                                                name: "ID",
                                                selector: (row) => row.id,
                                                sortable: true,
                                            },
                                            {
                                                name: "Photo",
                                                selector: (row) => row.photo,
                                                cell: (row) => (
                                                    <img
                                                        src={`/storage/${row.photo}`}
                                                        alt={row.name}
                                                        className="h-12 w-12 rounded-full"
                                                    />
                                                ),
                                            },
                                            {
                                                name: "Name",
                                                selector: (row) => row.name,
                                                sortable: true,
                                            },
                                            {
                                                name: "Email",
                                                selector: (row) => row.email,
                                                sortable: true,
                                            },
                                            {
                                                name: "Action",
                                                selector: (row) => row.action,
                                                cell: (row) => (
                                                    <Link
                                                        href={route("lecturers.evaluate", {
                                                            'lecturer': row.id, 
                                                            'course': course.id }
                                                        )}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Evaluate Lecturer
                                                    </Link>
                                                ),
                                            }
                                        ]}
                                        pagination
                                        highlightOnHover
                                    />
                                ) : (
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            No lecturers assigned to this course.
                                        </dt>
                                    </div>
                                )}
                            </dl>
                        </div>
                </div>
                                </>
                            )}
                    
                </div>            
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p>Are you sure you want to delete this course?</p>
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