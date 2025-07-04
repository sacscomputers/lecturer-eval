import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

export default function Index({
    evaluations,
    semesters,
    academicYears,
    metrics,
    lecturers,
}) {
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
    const [selectedMetric, setSelectedMetric] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState("");

    const filteredEvaluations = useMemo(() => {
        const filtered = evaluations.filter((evaluation) => {
            const matchesSemester = selectedSemester
                ? evaluation.semester_id == parseInt(selectedSemester)
                : true;
            const matchesAcademicYear = selectedAcademicYear
                ? evaluation.academic_year_id == parseInt(selectedAcademicYear)
                : true;
            const matchesMetric = selectedMetric
                ? evaluation.metric_id == parseInt(selectedMetric)
                : true;
            const matchesLecturer = selectedLecturer
                ? evaluation.lecturer_id == parseInt(selectedLecturer)
                : true;
            return (
                matchesSemester &&
                matchesAcademicYear &&
                matchesMetric &&
                matchesLecturer
            );
        });

        const uniqueMap = new Map();
        for (const evalItem of filtered) {
            const key = `${evalItem.lecturer_id}-${evalItem.course_id}-${evalItem.metric_id}`;
            if (!uniqueMap.has(key)) {
                const similar = filtered.filter(
                    (e) =>
                        e.lecturer_id == evalItem.lecturer_id &&
                        e.course_id == evalItem.course_id &&
                        e.metric_id == evalItem.metric_id
                );
                console.log(`EvalItem: ${evalItem}`);
                const totalRating = similar.reduce(
                    (sum, e) => sum + parseInt(e.rating, 10),
                    0
                );
                uniqueMap.set(key, {
                    ...evalItem,
                    average_rating: totalRating / similar.length,
                    total_evaluations: similar.length,
                });
                console.log("Aggregated unique evaluation item:", {
                    ...evalItem,
                    average_rating: totalRating / similar.length,
                    total_evaluations: similar.length,
                });
            }
        }

        return Array.from(uniqueMap.values());
    }, [
        selectedSemester,
        selectedAcademicYear,
        selectedMetric,
        selectedLecturer,
        evaluations,
    ]);
    filteredEvaluations.forEach((evalItem, index) => {
        console.log(`Evaluation ${index + 1}:`, evalItem);
    });

    const barChartData = useMemo(() => {
        // Get all evaluations that match the current filters
        const filtered = evaluations.filter((evaluation) => {
            const matchesSemester = selectedSemester
                ? evaluation.semester_id == parseInt(selectedSemester)
                : true;
            const matchesAcademicYear = selectedAcademicYear
                ? evaluation.academic_year_id == parseInt(selectedAcademicYear)
                : true;
            const matchesMetric = selectedMetric
                ? evaluation.metric_id == parseInt(selectedMetric)
                : true;
            const matchesLecturer = selectedLecturer
                ? evaluation.lecturer_id == parseInt(selectedLecturer)
                : true;
            return (
                matchesSemester &&
                matchesAcademicYear &&
                matchesMetric &&
                matchesLecturer
            );
        });

        return {
            labels: lecturers.map((lecturer) => lecturer.name),
            datasets: [
                {
                    label: "Average Rating",
                    data: lecturers.map((lecturer) => {
                        // Get all filtered evaluations for this lecturer
                        const lecturerEvals = filtered.filter(
                            (e) => e.lecturer_id == lecturer.id
                        );
                        const total = lecturerEvals.reduce(
                            (sum, e) => sum + (parseFloat(e.rating) || 0),
                            0
                        );
                        return lecturerEvals.length
                            ? total / lecturerEvals.length
                            : 0;
                    }),
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 0.5,
                    borderRadius: 5,
                },
            ],
        };
    }, [
        selectedSemester,
        selectedAcademicYear,
        selectedMetric,
        selectedLecturer,
        evaluations,
        lecturers,
    ]);

    const lineChartData = useMemo(() => {
        // Get all evaluations that match the current filters
        const filtered = evaluations.filter((evaluation) => {
            const matchesSemester = selectedSemester
                ? evaluation.semester_id == parseInt(selectedSemester)
                : true;
            const matchesAcademicYear = selectedAcademicYear
                ? evaluation.academic_year_id == parseInt(selectedAcademicYear)
                : true;
            const matchesMetric = selectedMetric
                ? evaluation.metric_id == parseInt(selectedMetric)
                : true;
            const matchesLecturer = selectedLecturer
                ? evaluation.lecturer_id == parseInt(selectedLecturer)
                : true;
            return (
                matchesSemester &&
                matchesAcademicYear &&
                matchesMetric &&
                matchesLecturer
            );
        });

        const groupedByDate = {};
        filtered.forEach((evaluation) => {
            const date = evaluation.created_at.split("T")[0];
            if (!groupedByDate[date]) groupedByDate[date] = [];
            groupedByDate[date].push(evaluation.rating);
        });

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
    }, [
        selectedSemester,
        selectedAcademicYear,
        selectedMetric,
        selectedLecturer,
        evaluations,
    ]);

    const columns = [
        {
            name: "Lecturer Name",
            selector: (row) => (
                <Link
                    href={route("users.show", row.lecturer.id)}
                    className="underline"
                >
                    {row.lecturer.name}
                </Link>
            ),
            sortable: true,
        },
        {
            name: "Course Name",
            selector: (row) => (
                <Link
                    href={route("courses.show", row.course.id)}
                    className="underline"
                >
                    {row.course.title}
                </Link>
            ),
            sortable: true,
        },
        {
            name: "Metric",
            selector: (row) => (
                <Link
                    href={route("metrics.show", row.metric.name)}
                    className="underline"
                >
                    {row.metric.name}
                </Link>
            ),
            sortable: true,
        },
        {
            name: "Average Rating",
            selector: (row) => row.average_rating?.toFixed(2),
            sortable: true,
        },
        {
            name: "Total Evaluations",
            selector: (row) => row.total_evaluations,
            sortable: true,
        },
    ];

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


    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Evaluations
                </h2>
            }
        >
            <Head title="Evaluations" />
            <div className="p-6 bg-gray-100 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        {
                            value: selectedSemester,
                            setter: setSelectedSemester,
                            options: semesters,
                            label: "Semester",
                        },
                        {
                            value: selectedAcademicYear,
                            setter: setSelectedAcademicYear,
                            options: academicYears,
                            label: "Academic Year",
                        },
                        {
                            value: selectedMetric,
                            setter: setSelectedMetric,
                            options: metrics,
                            label: "Metric",
                        },
                        {
                            value: selectedLecturer,
                            setter: setSelectedLecturer,
                            options: lecturers,
                            label: "Lecturer",
                        },
                    ].map((filter, index) => (
                        <select
                            key={index}
                            value={filter.value}
                            onChange={(e) => filter.setter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2"
                        >
                            <option value="">All {filter.label}s</option>
                            {filter.options.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    ))}
                </div>

                {/* <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <DataTable columns={columns} data={filteredEvaluations} pagination responsive />
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-bold mb-4">
                            Average Ratings per Lecturer
                        </h2>
                        <Bar data={barChartData} />
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h2 className="text-lg font-bold mb-4">
                            Rating Trends Over Time
                        </h2>
                        <Line data={lineChartData} options={lineChartOptions}/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
