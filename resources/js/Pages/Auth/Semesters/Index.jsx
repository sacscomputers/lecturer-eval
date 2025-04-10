import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Index({ semesters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const { delete: destroy } = useForm();
    const { data, setData, post, progress } = useForm({
        file: null,
    });

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
            name: "Start Date",
            selector: (row) => row.start_date,
        },
        {
            name: "End Date",
            selector: (row) => row.end_date,
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <Link
                        href={route("semesters.show", row.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        View
                    </Link>
                    <Link
                        href={route("semesters.edit", row.id)}
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

    function submit(e) {
        e.preventDefault();
        post("/semesters/bulk-upload");
    }

    const openModal = (semester) => {
        setSelectedSemester(semester);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedSemester(null);
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("semesters.destroy", selectedSemester.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Semesters
                </h2>
            }
        >
            <Head title="Semesters" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Bulk Upload and Create Semester */}
                        <div className="flex justify-between items-center mb-4">
                            {/* Bulk Upload Semesters */}
                            {/* <form
                                onSubmit={submit}
                                className="flex items-center gap-2"
                            >
                                <input
                                    className="text-sm text-gray-900 border border-gray-300 rounded-l-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 px-3 py-2"
                                    type="file"
                                    onChange={(e) =>
                                        setData("file", e.target.files[0])
                                    }
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                                >
                                    Bulk Upload
                                </button>
                            </form> */}

                            {/* Create Semester Button */}
                            <Link
                                href={route("semesters.create")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Create Semester
                            </Link>
                        </div>

                        {/* Semesters list */}
                        <DataTable
                            columns={columns}
                            data={semesters}
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p>Are you sure you want to delete this semester?</p>
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