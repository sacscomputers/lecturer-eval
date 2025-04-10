import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Link, Head, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index({
    schedules,
    courses,
    semesters,
    lecturers,
    venues,
    academicYears,
}) {
    const user = usePage().props.auth.user;
    const [filteredSchedules, setFilteredSchedules] = useState(schedules);

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedLecturer, setSelectedLecturer] = useState("");
    const [selectedVenue, setSelectedVenue] = useState("");
    const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState("");

    // Filter schedules based on selected filters
    useEffect(() => {
        const filtered = schedules.filter((schedule) => {
            const matchesCourse = selectedCourse
                ? schedule.course_id === parseInt(selectedCourse)
                : true;
            const matchesSemester = selectedSemester
                ? schedule.semester_id === parseInt(selectedSemester)
                : true;
            const matchesLecturer = selectedLecturer
                ? schedule.lecturer_id === parseInt(selectedLecturer)
                : true;
            const matchesVenue = selectedVenue
                ? schedule.venue === selectedVenue
                : true;
            const matchesAcademicYear = selectedAcademicYear
                ? schedule.academic_year_id === parseInt(selectedAcademicYear)
                : true;
            const matchesDayOfWeek = selectedDayOfWeek
                ? schedule.day_of_week === selectedDayOfWeek
                : true;

            return (
                matchesCourse &&
                matchesSemester &&
                matchesLecturer &&
                matchesVenue &&
                matchesAcademicYear &&
                matchesDayOfWeek
            );
        });

        setFilteredSchedules(filtered);
    }, [
        selectedCourse,
        selectedSemester,
        selectedLecturer,
        selectedVenue,
        selectedAcademicYear,
        selectedDayOfWeek,
        schedules,
    ]);

  // Map schedules to FullCalendar events with recurrence
const events = filteredSchedules.flatMap((schedule) => {
    // Convert day_of_week to a valid date
    const dayOfWeekMap = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
    };

    const targetDay = dayOfWeekMap[schedule.day_of_week]; // Map day_of_week to a number

    // Define the start and end dates for the recurrence (e.g., semester start and end dates)
    const semesterStartDate = new Date(schedule.semester.start_date);
    const semesterEndDate = new Date(schedule.semester.end_date);

    // Generate recurring events for each week within the semester
    const recurringEvents = [];
    let currentDate = new Date(semesterStartDate);

    // Adjust the currentDate to the first occurrence of the target day
    while (currentDate.getDay() !== targetDay) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate events for each week
    while (currentDate <= semesterEndDate) {
        const startDateTime = `${currentDate.toISOString().split("T")[0]}T${schedule.start_time}`;
        const endDateTime = `${currentDate.toISOString().split("T")[0]}T${schedule.end_time}`;

        recurringEvents.push({
            title: `${schedule.course.title} (${schedule.lecturer.name})`,
            start: startDateTime,
            end: endDateTime,
            extendedProps: {
                venue: schedule.venue,
                id: schedule.id,
            },
        });

        // Move to the next week
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return recurringEvents;
});
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Schedules
                </h2>
            }
        >
            <Head title="Schedules" />
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Create Schedule Button */}
                { user.role == 'admin' && (<div className="mb-6">
                    <Link
                        href={route("schedules.create")}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                        Create Schedule
                    </Link>
                </div>)
}
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value="">All Courses</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.title}
                            </option>
                        ))}
                    </select>

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

                    <select
                        value={selectedVenue}
                        onChange={(e) => setSelectedVenue(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value="">All Venues</option>
                        {venues.map((venue) => (
                            <option key={venue} value={venue}>
                                {venue}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedAcademicYear}
                        onChange={(e) =>
                            setSelectedAcademicYear(e.target.value)
                        }
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
                        value={selectedDayOfWeek}
                        onChange={(e) => setSelectedDayOfWeek(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                        <option value="">All Days</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>

                {/* FullCalendar */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin
                        ]}
                        initialView="timeGridWeek"
                        events={events}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,list",
                        }}
                        height="auto"
                        eventClick={(info) => {
                            console.log(info.event.extendedProps.id);
                            // Handle event click (e.g., navigate to schedule details)
                            window.location.href = `/schedules/${info.event.extendedProps.id}`;
                        }} 
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
