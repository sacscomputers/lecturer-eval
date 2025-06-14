import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Index({ courses }) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { delete: destroy } = useForm();
    console.log(courses)

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Title",
            selector: (row) =>  <Link
            href={route("courses.show", row.id)}
            className="underline"
        >
            {row.title}
        </Link>,
        },
        {
            name: "Code",
            selector: (row) => row.code,
        },
        {
            name: "Department",
            selector: (row) => <><Link href={route('departments.show', row.department.id)} className="hover:underline">{row.department.name}</Link></> || "N/A",
        },
        {
            name: "Photo",
            selector: (row) =>
                row.photo ? (
                    <img
                        src={`/storage/${row.photo}`}
                        alt={row.title}
                        className="h-12 w-12 object-cover"
                    />
                ) : (
                    "N/A"
                ),
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <Link
                        href={route("courses.show", row.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        View
                    </Link>
                   { user.role_names.includes('admin') && ( 
                    <>
                    <Link
                        href={route("courses.edit", row.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => openModal(row)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </>
                )}
                </>
            ),
        },
    ];

    const openModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("courses.destroy", selectedCourse.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Courses
                </h2>
            }
        >
            <Head title="Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Create Course Button */}
                        { user.role_names.includes('admin') && (<div className="flex justify-between items-center mb-4">
                            <Link
                                href={route("courses.create")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Create Course
                            </Link>
                        </div>)}

                        {/* Courses List */}
                        <DataTable
                            columns={columns}
                            data={courses}
                            direction="auto"
                            fixedHeaderScrollHeight="300px"
                            pagination
                            responsive
                            subHeaderAlign="right"
                            subHeaderWrap
                        />
                    </div>
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
                            Are you sure you want to delete the course{" "}
                            <strong>{selectedCourse?.title}</strong>?
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