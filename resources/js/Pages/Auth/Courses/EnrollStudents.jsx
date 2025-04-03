import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Select from "react-select";
import { Head, useForm } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function EnrollStudents({
    course,
    students,
    levels,
    coursesOfStudy,
    academicYears,
    semesters,
    studentsEnrolled,
}) {
    const { data, setData, post, processing } = useForm({
        student_ids: [],
        level: "",
        course_of_study_id: "",
        academic_year_id: "",
        semester_id: "",
    });

    const columns = [
        // {
        //     name: "Select",
        //     cell: (row) => (
        //         <input
        //             type="checkbox"
        //             checked={data.student_ids.includes(row.id)}
        //             onChange={() => handleCheckboxChange(row.id)}
        //         />
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
    ];

    const [filteredStudents, setFilteredStudents] = useState(students);

    console.log(students);
    const [filteredSemesters, setFilteredSemesters] = useState([]);

    // Handle academic year selection
    const handleAcademicYearChange = (selectedOption) => {
        setData("academic_year_id", selectedOption ? selectedOption.value : "");
        // Filter semesters based on the selected academic year
        const filtered = semesters.filter(
            (semester) => semester.academic_year_id === selectedOption.value
        );
        setFilteredSemesters(filtered);
        setData("semester_id", ""); // Reset semester selection
    };

    // Handle semester selection
    const handleSemesterChange = (selectedOption) => {
        setData("semester_id", selectedOption ? selectedOption.value : "");
    };

    // Filter students based on level and course of study
    const handleFilterStudents = () => {
        if (!data.level || !data.course_of_study_id) {
            alert("Please select both level and course of study.");
            return;
        }

        const filtered = students.filter(
            (student) =>
                student.level == data.level &&
                student.course_of_study_id == data.course_of_study_id
        );

        setFilteredStudents(filtered);
    };

    // Handle checkbox selection for students
    const handleCheckboxChange = (studentId) => {
        const updatedStudentIds = data.student_ids.includes(studentId)
            ? data.student_ids.filter((id) => id !== studentId) // Remove if already selected
            : [...data.student_ids, studentId]; // Add if not selected

        setData("student_ids", updatedStudentIds);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !data.academic_year_id ||
            !data.semester_id ||
            data.student_ids.length === 0
        ) {
            alert(
                "Please select an academic year, a semester, and at least one student."
            );
            return;
        }
        post(route("courses.enroll-students", course.id));
    };

    // Map levels to options for react-select
    const levelOptions = levels.map((level) => ({
        value: level,
        label: `${level} Level`,
    }));

    // Map courses of study to options for react-select
    const courseOfStudyOptions = coursesOfStudy.map((course) => ({
        value: course.id,
        label: course.name,
    }));

    // Map academic years to options for react-select
    const academicYearOptions = academicYears.map((year) => ({
        value: year.id,
        label: year.name,
    }));

    // Map semesters to options for react-select
    const semesterOptions = filteredSemesters.map((semester) => ({
        value: semester.id,
        label: semester.name,
    }));

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
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <h3 className="text-lg font-semibold mb-4">
                            Enroll Students
                        </h3>
                        <form onSubmit={handleSubmit}>
                            {/* Academic Year Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Academic Year
                                </label>
                                <Select
                                    options={academicYearOptions}
                                    onChange={handleAcademicYearChange}
                                    className="mt-1"
                                />
                            </div>

                            {/* Semester Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Semester
                                </label>
                                <Select
                                    options={semesterOptions}
                                    onChange={handleSemesterChange}
                                    className="mt-1"
                                    isDisabled={!data.academic_year_id}
                                />
                            </div>

                            {/* Filter Students */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Filter Students by Level and Course of Study
                                </label>
                                <div className="flex space-x-4">
                                    <Select
                                        options={levelOptions}
                                        onChange={(selectedOption) =>
                                            setData(
                                                "level",
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <Select
                                        options={courseOfStudyOptions}
                                        onChange={(selectedOption) =>
                                            setData(
                                                "course_of_study_id",
                                                selectedOption
                                                    ? selectedOption.value
                                                    : ""
                                            )
                                        }
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleFilterStudents}
                                        className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>

                            {/* Display Filtered Students */}
                            {filteredStudents.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700">
                                        Filtered Students
                                    </h4>
                                    <DataTable
                                        columns={columns}
                                        data={filteredStudents}
                                        pagination
                                        highlightOnHover
                                        selectableRows
                                        onSelectedRowsChange={({
                                            selectedRows,
                                        }) =>
                                            setData(
                                                "student_ids",
                                                selectedRows.map((s) => s.id)
                                            )
                                        }
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                disabled={processing}
                            >
                                Enroll Students
                            </button>
                        </form>
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
        </AuthenticatedLayout>
    );
}
