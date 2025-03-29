import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import StudentSelect from "@/Components/StudentSelect"; // A component similar to CourseSelect for selecting students
import { Head, useForm } from "@inertiajs/react";

export default function EnrollStudents({ course, studentsEnrolled }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { post: post } = useForm();

    const openModal = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };

    const handleUnenroll = () => {
        console.log("Unenrolling student:", selectedStudent);
        console.log("Course ID:", course.id);
        console.log("Student ID:", selectedStudent.id);
        post(route("courses.unenroll-students", { course: course.id, student: selectedStudent.id}), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Enroll Students in {course.title}
                </h2>
            }
        >
            <Head title="Enroll Students" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Enroll New Students */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Enroll New Students
                        </h3>
                        <StudentSelect routeName="students.search" courseId={course?.id} />
                    </div>

                    {/* Display Enrolled Students */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Enrolled Students
                        </h3>
                        {studentsEnrolled.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentsEnrolled.map((student) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button
                                                    onClick={() => openModal(student)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Unenroll
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No students enrolled in this course.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Unenroll Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Unenroll
                        </h2>
                        <p>
                            Are you sure you want to unenroll{" "}
                            <strong>{selectedStudent?.name}</strong> from this course?
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={closeModal}
                                className="text-gray-600 hover:text-gray-900 mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnenroll}
                                className="text-red-600 hover:text-red-900"
                            >
                                Unenroll
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}