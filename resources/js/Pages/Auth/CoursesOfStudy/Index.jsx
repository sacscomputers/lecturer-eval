import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Index({ coursesOfStudy }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { delete: destroy } = useForm();

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Code",
            selector: (row) => row.code,
        },
        {
            name: "Department",
            selector: (row) => row.department?.name || "N/A",
        },
        {
            name: "Duration (Years)",
            selector: (row) => row.duration_years,
        },
        {
            name: "Degree Type",
            selector: (row) => row.degree_type,
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <Link
                        href={route("coursesOfStudy.show", row.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        View
                    </Link>
                    <Link
                        href={route("coursesOfStudy.edit", row.id)}
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
        destroy(route("coursesOfStudy.destroy", selectedCourse.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Courses of Study
                </h2>
            }
        >
            <Head title="Courses of Study" />

            <div className="py-5">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Create Course of Study Button */}
                        <div className="flex justify-between items-center mb-4">
                            <Link
                                href={route("coursesOfStudy.create")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Create Course of Study
                            </Link>
                        </div>

                        {/* Courses of Study List */}
                        <DataTable
                            columns={columns}
                            data={coursesOfStudy ? coursesOfStudy : []}
                            noDataComponent="No courses of study found"
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
                            Are you sure you want to delete the course of study{" "}
                            <strong>{selectedCourse?.name}</strong>?
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