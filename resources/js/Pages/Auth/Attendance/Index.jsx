import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Index({ attendances }) {
    const user = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState(null);
    const { delete: destroy } = useForm();

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Course",
            selector: (row) =>
                (
                    <Link
                        href={route("courses.show", row.course?.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        {row.course?.title}
                    </Link>
                ) || "N/A",
        },
        {
            name: "Lecturer",
            selector: (row) => (
                <Link
                    href={route("users.show", row.lecturer?.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                >
                    {row.lecturer?.name}
                </Link>
            ) || "N/A",
        },
        {
            name: "Semester",
            selector: (row) => (
                <Link
                    href={route("semesters.show", row.semester?.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                >
                    {row.semester?.name}
                </Link>
            ) || "N/A",
        },
        {
            name: "Academic Year",
            selector: (row) => (
                <Link
                    href={route("academicYears.show", row.academic_year?.id)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                >
                    {row.academic_year?.name}
                </Link>
            ) || "N/A",
        },
        {
            name: "Status",
            selector: (row) => row.status,
        },
        {
            name: "Arrival Time",
            selector: (row) => row.arrival_time || "N/A",
        },
        {
            name: "Departure Time",
            selector: (row) => row.departure_time || "N/A",
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <Link
                        href={route("attendance.show", row.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        View
                    </Link>
                    {(user.role == "admin" || user.role == "hod") && (
                        <>
                            <Link
                                href={route("attendance.edit", row.id)}
                                className="text-yellow-600 hover:text-yellow-900 mr-4"
                            >
                                Edit
                            </Link>
                            {}
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

    const openModal = (attendance) => {
        setSelectedAttendance(attendance);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedAttendance(null);
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("attendance.destroy", selectedAttendance.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Attendance Records
                </h2>
            }
        >
            <Head title="Attendance Records" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Create Attendance Button */}
                        <div className="flex justify-between items-center mb-4">
                            <Link
                                href={route("attendance.create")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Record Attendance
                            </Link>
                        </div>

                        {/* Attendance List */}
                        <DataTable
                            columns={columns}
                            data={attendances}
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
                            Are you sure you want to delete this attendance
                            record?
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
