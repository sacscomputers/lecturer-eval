import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
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
    const [filteredEvaluations, setFilteredEvaluations] = useState(evaluations);

    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
    const [selectedMetric, setSelectedMetric] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState("");

    // Filter evaluations based on selected filters
    useEffect(() => {
        const filtered = evaluations.filter((evaluation) => {
            const matchesSemester = selectedSemester
                ? evaluation.semester_id === parseInt(selectedSemester)
                : true;
            const matchesAcademicYear = selectedAcademicYear
                ? evaluation.academic_year_id === parseInt(selectedAcademicYear)
                : true;
            const matchesMetric = selectedMetric
                ? evaluation.metric_id === parseInt(selectedMetric)
                : true;
            const matchesLecturer = selectedLecturer
                ? evaluation.lecturer_id === parseInt(selectedLecturer)
                : true;
    
            return (
                matchesSemester &&
                matchesAcademicYear &&
                matchesMetric &&
                matchesLecturer
            );
        });
    
        // Calculate average_rating and total_evaluations for each row
        const aggregatedEvaluations = filtered.map((evaluation) => {
            const lecturerEvaluations = filtered.filter(
                (e) =>
                    e.lecturer_id === evaluation.lecturer_id &&
                    e.course_id === evaluation.course_id &&
                    e.metric_id === evaluation.metric_id
            );
    
            const totalRating = lecturerEvaluations.reduce(
                (sum, e) => sum + e.rating,
                0
            );
    
            return {
                ...evaluation,
                average_rating: lecturerEvaluations.length
                    ? totalRating / lecturerEvaluations.length
                    : 0,
                total_evaluations: lecturerEvaluations.length,
            };
        });
    
        setFilteredEvaluations(aggregatedEvaluations);
    }, [selectedSemester, selectedAcademicYear, selectedMetric, selectedLecturer, evaluations]);

    // Data for the bar chart
    const barChartData = {
        labels: lecturers.map((lecturer) => lecturer.name),
        datasets: [
            {
                label: "Average Rating",
                data: lecturers.map((lecturer) => {
                    const lecturerEvaluations = filteredEvaluations.filter(
                        (evaluation) => evaluation.lecturer_id === lecturer.id
                    );
                    const totalRating = lecturerEvaluations.reduce(
                        (sum, evaluation) => sum + evaluation.rating,
                        0
                    );
                    return lecturerEvaluations.length
                        ? totalRating / lecturerEvaluations.length
                        : 0;
                }),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    // Data for the line chart
    const lineChartData = {
        labels: [...new Set(filteredEvaluations.map((e) => e.created_at))],
        datasets: [
            {
                label: "Rating Trends",
                data: [...new Set(filteredEvaluations.map((e) => e.created_at))].map(
                    (date) => {
                        const evaluationsOnDate = filteredEvaluations.filter(
                            (evaluation) => evaluation.created_at === date
                        );
                        const totalRating = evaluationsOnDate.reduce(
                            (sum, evaluation) => sum + evaluation.rating,
                            0
                        );
                        return evaluationsOnDate.length
                            ? totalRating / evaluationsOnDate.length
                            : 0;
                    }
                ),
                fill: false,
                borderColor: "rgba(75, 192, 192, 1)",
                tension: 0.1,
            },
        ],
    };

    // Columns for the data table
    const columns = [
        {
            name: "Lecturer Name",
            selector: (row) => row.lecturer.name,
            sortable: true,
        },
        {
            name: "Course Name",
            selector: (row) => row.course.title,
            sortable: true,
        },
        {
            name: "Metric",
            selector: (row) => row.metric.name,
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

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="">All Semesters</option>
                    {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                            {semester.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedAcademicYear}
                    onChange={(e) => setSelectedAcademicYear(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="">All Academic Years</option>
                    {academicYears.map((year) => (
                        <option key={year.id} value={year.id}>
                            {year.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="">All Metrics</option>
                    {metrics.map((metric) => (
                        <option key={metric.id} value={metric.id}>
                            {metric.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedLecturer}
                    onChange={(e) => setSelectedLecturer(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2"
                >
                    <option value="">All Lecturers</option>
                    {lecturers.map((lecturer) => (
                        <option key={lecturer.id} value={lecturer.id}>
                            {lecturer.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Data Table */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <DataTable
                    columns={columns}
                    data={filteredEvaluations}
                    pagination
                    responsive
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Average Ratings per Lecturer</h2>
                    <Bar data={barChartData} />
                </div>

                {/* Line Chart */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">Rating Trends Over Time</h2>
                    <Line data={lineChartData} />
                </div>
            </div>
        </div>
        </AuthenticatedLayout>
    );
}