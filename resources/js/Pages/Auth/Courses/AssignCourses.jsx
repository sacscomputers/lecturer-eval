import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CourseSelect from "@/Components/CourseSelect";
import { Head, useForm } from "@inertiajs/react";

export default function AssignCourses({ lecturer, coursesAssigned }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const { delete: destroy } = useForm();

    const openModal = (course) => {
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCourse(null);
        setIsModalOpen(false);
    };

    const handleUnassign = () => {
        destroy(route("lecturer.unassign-course", { lecturer: lecturer.id, course: selectedCourse.id }), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Assign Courses to {lecturer.name}
                </h2>
            }
        >
            <Head title="Assign Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Assign New Courses */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Assign New Courses
                        </h3>
                        <CourseSelect routeName="courses.search" lecturerId={lecturer?.id} coursesAssigned={coursesAssigned}/>
                    </div>

                    {/* Display Assigned Courses */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Assigned Courses
                        </h3>
                        {coursesAssigned.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {coursesAssigned.map((course) => (
                                        <tr key={course.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {course.title}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {course.code}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(course)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Unassign
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No courses assigned to this lecturer.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Unassign Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Unassign
                        </h2>
                        <p>
                            Are you sure you want to unassign the course{" "}
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
                                onClick={handleUnassign}
                                className="text-red-600 hover:text-red-900"
                            >
                                Unassign
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}