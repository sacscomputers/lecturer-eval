import ApplicationLogo from "@/Components/ApplicationLogo";
import Alert from "@/Components/Alert";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { error, success, info } = usePage().props.flash;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const roleNames = user.role_names; // Array of user roles

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <Link href="/">
                        <ApplicationLogo className="h-8 w-auto" />
                    </Link>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        ✖
                    </button>
                </div>
                <nav className="mt-4 space-y-2">
                    <Link
                        href={route("dashboard")}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Dashboard
                    </Link>
                    {roleNames.includes("admin") && (
                        <>
                            <Link
                                href={route("academicYears.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Academic Years
                            </Link>

                            <Link
                                href={route("semesters.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Semesters
                            </Link>
                        </>
                    )}

                    {/* Admin and HOD Links */}
                    {(roleNames.includes("admin") ||
                        roleNames.includes("hod")) && (
                        <>
                            <Link
                                href={route("users.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Users
                            </Link>
                            <Link
                                href={route("departments.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Departments
                            </Link>
                            <Link
                                href={route("coursesOfStudy.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Courses of Study
                            </Link>
                            <Link
                                href={route("metrics.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Metrics
                            </Link>
                            {/* Evaluations */}
                            <Link
                                href={route("evaluations.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Evaluations
                            </Link>
                        </>
                    )}

                    {/* Common Links */}
                    <Link
                        href={route("courses.index")}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Courses
                    </Link>

                    {/* Schedule and Attendance Links */}
                    {(roleNames.includes("admin") ||
                        roleNames.includes("hod") ||
                        roleNames.includes("course rep")) && (
                        <>
                            <Link
                                href={route("schedules.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Schedule
                            </Link>
                            <Link
                                href={route("attendance.index")}
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Attendance Tracking
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow fixed w-full z-10">
                    <div className="flex items-center justify-between px-4 py-4">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            ☰
                        </button>
                        <div className="flex items-center space-x-4">
                            <img
                                src={`/storage/${user.photo}`}
                                alt={user.name}
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="text-gray-700">{user.name}</span>
                            <Link
                                href={route("profile.edit")}
                                active={route().current("profile.edit")}
                            >
                                Profile
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                            >
                                Log Out
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Header */}
                {header && (
                    <header className="bg-white shadow mt-10">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 mt-5">
                            {header}
                            {/* Display Alerts */}
                            {success && (
                                <Alert type="success" message={success} />
                            )}
                            {error && <Alert type="error" message={error} />}
                            {info && <Alert type="info" message={info} />}
                            {/* <SideBar /> */}
                        </div>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 p-6 ">{children}</main>
            </div>
        </div>
    );
}
