import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Show({ user, evaluations, metrics }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { delete: destroy } = useForm();
    console.log(evaluations)
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("users.destroy", user.id), {
            onSuccess: () => closeModal(),
        });
    };

    // Prepare data for the bar chart
    const chartData = {
        labels: metrics.map((metric) => metric.name),
        datasets: [
            {
                label: "Average Rating",
                data: metrics.map((metric) => {
                    const metricEvaluations = evaluations.filter(
                        (evaluation) => evaluation.metric_id === metric.id
                    );
                    const totalRating = metricEvaluations.reduce(
                        (sum, evaluation) => sum + evaluation.rating,
                        0
                    );
                    return metricEvaluations.length
                        ? totalRating / metricEvaluations.length
                        : 0;
                }),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    User Details
                </h2>
            }
        >
            <Head title="User Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Main Card */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("users.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
                                as="button"
                            >
                                Back
                            </Link>
                        </div>
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {user.name}
                                </h3>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    {/* Photo */}
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Photo
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            <img
                                                src={`/storage/${user.photo}`}
                                                alt={user.name}
                                                className="h-48"
                                            />
                                        </dd>
                                    </div>

                                    {/* Email */}
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Email
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user.email}
                                        </dd>
                                    </div>

                                    {/* Role */}
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Role
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {user.role}
                                        </dd>
                                    </div>

                                    {/* Student-Specific Fields */}
                                    {(user.role === "student" ||
                                        user.role === "course_rep") && (
                                        <>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Matric Number
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {user.matric_number}
                                                </dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Level
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {user.level}
                                                </dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">
                                                    Course of Study
                                                </dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                    {user.course_of_study?.name ||
                                                        "N/A"}
                                                </dd>
                                            </div>
                                        </>
                                    )}

                                    {/* Lecturer-Specific Fields */}
                                    {(user.role === "lecturer" ||
                                        user.role === "hod") && (
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Staff ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {user.staff_id}
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Link
                                href={route("users.edit", user.id)}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                                Edit
                            </Link>
                            {user.role === "lecturer" && (
                                <Link
                                    href={route("courses.assign", user.id)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                >
                                    Assign Courses
                                </Link>
                            )}
                            <button
                                onClick={openModal}
                                className="text-red-600 hover:text-red-900"
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Evaluation Summary and Bar Chart */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Evaluation Summary */}
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Evaluation Summary
                            </h3>
                            <ul className="list-disc pl-5">
                                <li>
                                    Total Evaluations: {evaluations.length}
                                </li>
                                <li>
                                    Average Rating:{" "}
                                    {(
                                        evaluations.reduce(
                                            (sum, evaluation) =>
                                                sum + evaluation.rating,
                                            0
                                        ) / evaluations.length || 0
                                    ).toFixed(2)}
                                </li>
                            </ul>
                        </div>

                        {/* Bar Chart */}
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <h3 className="text-lg font-semibold mb-4">
                                Performance by Metric
                            </h3>
                            <Bar data={chartData} />
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Confirm Delete
                        </h2>
                        <p>Are you sure you want to delete this user?</p>
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