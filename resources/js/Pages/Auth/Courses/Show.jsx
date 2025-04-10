import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Show({ course, department, lecturers, students }) {
    const user = usePage().props.auth.user;
    const { post: post } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({}); // { type: 'lecturer' | 'student', id: null }

    // Open the modal
    const openModal = (type, id) => {
        setModalContent({ type, id });
        setIsModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setModalContent({});
    };

    // Confirm the action (unassign or unenroll)
    const confirmAction = () => {
        if (modalContent.type === "lecturer") {
            post(
                route("courses.unassign-lecturer", {
                    course: course.id,
                    lecturer: modalContent.id,
                }),
                {
                    onSuccess: () => alert("Lecturer unassigned successfully."),
                }
            );
        } else if (modalContent.type === "student") {
            post(
                route("courses.unenroll-students", {
                    course: course.id,
                    student: modalContent.id,
                }),
                {
                    onSuccess: () => alert("Student unenrolled successfully."),
                }
            );
        }
        closeModal();
    };

    // Define columns for lecturers DataTable
    const lecturerColumns = [
        {
            name: "Photo",
            selector: (row) => (
                <img
                    src={`/storage/${row.photo}`}
                    alt={row.name}
                    className="h-8 w-8 rounded-full"
                />
            ),
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Action",
            cell: (row) => (
                <>
                    {user.role == "admin" && (
                        <button
                            onClick={() => openModal("lecturer", row.id)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Unassign
                        </button>
                    )}
                    {
                        (user.role == 'student' || user.role == 'course_rep' || user.role == 'hod') && (<Link
                            className="text-green-600 hover:text-green-900 ml-4"
                            href={route("lecturers.evaluate", {
                                course: course.id,
                                lecturer: row.id,
                            })}
                        >
                            Evaluate
                        </Link>)
                    }
                </>
            ),
        },
    ];

    // Define columns for students DataTable
    const studentColumns = [
        {
            name: "Photo",
            selector: (row) => (
                <img
                    src={`/storage/${row.photo}`}
                    alt={row.name}
                    className="h-8 w-8 rounded-full"
                />
            ),
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    onClick={() => openModal("student", row.id)}
                    className="text-red-600 hover:text-red-900"
                >
                    Unenroll
                </button>
            ),
        },
    ];

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
                    {/* Course Details */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {course.title}
                        </h3>
                        <dl>
                            {/* photo */}
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Photo
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    <img
                                        src={`/storage/${course.photo}`}
                                        alt={course.title}
                                        className="h-48 w-full object-cover rounded-lg"
                                    />
                                </dd>
                            </div>
                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Code
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {course.code}
                                </dd>
                            </div>
                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                    Department
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {department?.name || "N/A"}
                                </dd>
                            </div>
                        </dl>
                        <div className="mt-6 flex space-x-4 justify-end">
                            {/* Enroll Button */}
                            {(user.role == "hod" || user.role == "admin") && (
                                <Link
                                    href={route("courses.enroll", course.id)}
                                    className="text-green hover:text-green-700 px-4 py-2 "
                                >
                                    Enroll
                                </Link>
                            )}

                            {user.role == "admin" && (
                                <>
                                    <Link
                                        href={route("courses.edit", course.id)}
                                        className="text-blue-600 hover:text-blue-700 px-4 py-2 "
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() =>
                                            openModal("delete", course.id)
                                        }
                                        className="text-red-600 hover:text-red-700 px-4 py-2 "
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Confirmation Modal */}
                    {isModalOpen && modalContent.type === "delete" && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Confirm Delete
                                </h3>
                                <p className="text-sm text-gray-600 mb-6">
                                    Are you sure you want to delete this course?
                                    This action cannot be undone.
                                </p>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            post(
                                                route(
                                                    "courses.destroy",
                                                    course.id
                                                ),
                                                {
                                                    onSuccess: () =>
                                                        alert(
                                                            "Course deleted successfully."
                                                        ),
                                                }
                                            );
                                            closeModal();
                                        }}
                                        className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Lecturers and Students Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Lecturers */}
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Lecturers
                            </h3>
                            <DataTable
                                columns={lecturerColumns}
                                data={lecturers}
                                pagination
                                responsive
                            />
                        </div>

                        {/* Students */}
                        {user.role == "admin" && (
                            <>
                                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Students
                                    </h3>
                                    <DataTable
                                        columns={studentColumns}
                                        data={students}
                                        pagination
                                        responsive
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Confirm Action
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to{" "}
                            {modalContent.type === "lecturer"
                                ? "unassign this lecturer"
                                : "unenroll this student"}
                            ?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmAction}
                                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
