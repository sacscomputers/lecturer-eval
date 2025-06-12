import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { CheckCircle, Star } from "lucide-react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export default function Show({ user, evaluations, metrics, attendances }) {
    console.log(attendances);
    const authenticatedUser = usePage().props.auth.user;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { delete: destroy } = useForm();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleDelete = () => {
        destroy(route("users.destroy", user.id), {
            onSuccess: () => closeModal(),
        });
    };

    const metricLabels = metrics.map((metric) => metric.name);
    const metricAverages = metrics.map((metric) => {
        const metricEvaluations = evaluations.filter(
            (evaluation) => evaluation.metric_id == metric.id
        );
        const totalRating = metricEvaluations.reduce(
            (sum, evaluation) => sum + parseFloat(evaluation.rating) || 0,
            0
        );
        return metricEvaluations.length
            ? totalRating / metricEvaluations.length
            : 0;
    });

    const lineChartData = (() => {
        const groupedByDate = {};
        evaluations.forEach((evaluation) => {
            const date = evaluation.created_at.split("T")[0];
            if (!groupedByDate[date]) groupedByDate[date] = [];
            groupedByDate[date].push(evaluation.rating);
        });
        console.log(groupedByDate);

        const labels = Object.keys(groupedByDate);
        const data = labels.map((date) => {
            const ratings = groupedByDate[date];
            const total = ratings.reduce(
                (sum, r) => sum + (parseFloat(r) || 0),
                0
            );
            return total / ratings.length;
        });

        console.log(`Labels: ${labels}, Data: ${data}`);

        return {
            labels,
            datasets: [
                {
                    label: "Rating Trends",
                    data,
                    fill: false,
                    borderColor: "rgba(75, 192, 192, 1)",
                    tension: 0.4,
                },
            ],
        };
    })();

    const attendanceLabels = ["Present", "Absent"];
    const attendanceData = [attendances.present, attendances.absent];

    const donutChartData = {
        labels: attendanceLabels,
        datasets: [
            {
                data: attendanceData,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.7)", // Teal (matches other charts)
                    "rgba(239, 68, 68, 0.7)", // Red
                ],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(239, 68, 68, 1)"],
                borderWidth: 2,
            },
        ],
    };

    const barAttendanceData = {
        labels: attendanceLabels,
        datasets: [
            {
                label: "Attendance Count",
                data: attendanceData,
                backgroundColor: [
                    "rgba(75, 192, 192, 0.7)", // Teal
                    "rgba(239, 68, 68, 0.7)", // Red
                ],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(239, 68, 68, 1)"],
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const barChartData = {
        labels: metricLabels,
        datasets: [
            {
                label: "Average Rating",
                data: metricAverages,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                borderRadius: 10,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        scales: {
            y: {
                min: 0,
                max: 5,
                ticks: {
                    stepSize: 1,
                },
                title: {
                    display: true,
                    text: "Average Rating",
                },
            },
            x: {
                title: {
                    display: true,
                    text: "Date",
                },
            },
        },
    };

    const averageRating = (
        evaluations.reduce((sum, evalItem) => sum + parseFloat(evalItem.rating), 0) /
        (evaluations.length || 1)
    ).toFixed(2);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users / {user.name}
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
                                            Roles
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex">
                                            {user.role_names.map(
                                                (role_name) => (
                                                    <div className="bg-black/50 w-fit text-white shadow-sm rounded-lg px-5 mr-1">
                                                        {role_name}
                                                    </div>
                                                )
                                            )}
                                        </dd>
                                    </div>

                                    {/* Student-Specific Fields */}
                                    {(user.role_names.includes("student") ||
                                        user.role_names.includes(
                                            "course rep"
                                        )) && (
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
                                                    {user.course_of_study
                                                        ?.name || "N/A"}
                                                </dd>
                                            </div>
                                        </>
                                    )}

                                    {/* Lecturer-Specific Fields */}
                                    {(user.role_names.includes("lecturer") ||
                                        user.role_names.includes("hod")) && (
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
                            {user.role_names.includes("lecturer") && (
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

                    {/* Evaluation Summary and Charts */}
                    {user.role_names.includes("lecturer") && (
                        <>
                            <div className="grid grid-cols-auto md:grid-cols-12 gap-6 ">
                                {/* Evaluation Summary */}
                                <div className="bg-white p-6 shadow rounded-2xl space-y-4 w-fit h-fit md:col-span-2">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <Star className="text-yellow-500" />
                                        Evaluation Summary
                                    </h3>
                                    <div className="text-gray-700 space-y-2">
                                        <p className="flex items-center gap-2 text-base">
                                            <CheckCircle
                                                className="text-green-500"
                                                size={20}
                                            />
                                            <span className="font-medium">
                                                Total Evaluations:
                                            </span>
                                            <span className="text-lg font-bold">
                                                {evaluations.length}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2 text-base">
                                            <CheckCircle
                                                className="text-blue-500"
                                                size={20}
                                            />
                                            <span className="font-medium">
                                                Average Rating:
                                            </span>
                                            <span className="text-lg font-bold">
                                                {averageRating}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Line Chart */}
                                <div className="bg-white p-6 shadow rounded-2xl md:col-span-8">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Performance Trend (Line)
                                    </h3>
                                    <Line
                                        data={lineChartData}
                                        options={lineChartOptions}
                                    />
                                </div>

                                {/* Bar Chart - now bigger and below, spanning both columns */}
                                <div className="bg-white p-8 shadow rounded-2xl md:col-span-12">
                                    <h3 className="text-xl font-semibold mb-6">
                                        Performance by Metric (Bar)
                                    </h3>
                                    <Bar
                                        data={barChartData}
                                        height={120}
                                        options={{
                                            responsive: true,
                                            scales: {
                                                y: {
                                                    min: 0,
                                                    max: 5,
                                                    ticks: {
                                                        stepSize: 1,
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                            {/* Attendance Charts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                {/* Donut Chart Card */}
                                <div className="bg-white p-6 shadow rounded-2xl flex flex-col items-center">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Attendance Distribution
                                    </h3>
                                    <Doughnut data={donutChartData} />
                                    <div className="flex justify-center gap-4 mt-4">
                                        <span className="flex items-center gap-2">
                                            <span className="inline-block w-full h-3 rounded-full bg-green-500"></span>
                                            Present: {attendances.present}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="inline-block w-1/2 h-3 rounded-full bg-red-500"></span>
                                            Absent: {attendances.absent}
                                        </span>
                                    </div>
                                </div>
                                {/* Bar Chart Card */}
                                <div className="bg-white p-6 shadow rounded-2xl flex flex-col items-center">
                                    <h3 className="text-lg font-semibold mb-4">
                                        Attendance Bar Chart
                                    </h3>
                                    <Bar data={barAttendanceData} />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
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
