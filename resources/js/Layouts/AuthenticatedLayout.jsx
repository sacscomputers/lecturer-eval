import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import SideBar from "@/Components/SideBar";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    console.log(user);
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            <div className="hidden sm:ms-10 sm:flex">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Navigation
                                            <svg
                                                className="-me-1 ms-2 h-5 w-5"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard"
                                            )}
                                        >
                                            Dashboard
                                        </Dropdown.Link>
                                        {user.role === "admin" && (
                                            <>
                                                <Dropdown.Link
                                                    href={route("users.index")}
                                                    active={route().current(
                                                        "users.index"
                                                    )}
                                                >
                                                    Users
                                                </Dropdown.Link>

                                                <Dropdown.Link
                                                    href={route(
                                                        "departments.index"
                                                    )}
                                                    active={route().current(
                                                        "departments.index"
                                                    )}
                                                >
                                                    Departments
                                                </Dropdown.Link>

                                                <Dropdown.Link
                                                    href={route(
                                                        "coursesOfStudy.index"
                                                    )}
                                                    active={route().current(
                                                        "coursesOfStudy.index"
                                                    )}
                                                >
                                                    Courses of Study
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "metrics.index"
                                                    )}
                                                    active={route().current(
                                                        "metrics.index"
                                                    )}
                                                >
                                                    Metrics
                                                </Dropdown.Link>
                                            </>
                                        )}

                                        <Dropdown.Link
                                            href={route("courses.index")}
                                            active={route().current(
                                                "courses.index"
                                            )}
                                        >
                                            Courses
                                        </Dropdown.Link>

                                        {(user.role == "admin" ||
                                            (user.role == "hod") |
                                                (user.role ==
                                                    "course_rep")) && (
                                            <>
                                                <Dropdown.Link
                                                    href={route(
                                                        "schedules.index"
                                                    )}
                                                    active={route().current(
                                                        "schedules.index"
                                                    )}
                                                >
                                                    Schedule
                                                </Dropdown.Link>

                                                <Dropdown.Link
                                                    href={route(
                                                        "attendance.index"
                                                    )}
                                                    active={route().current(
                                                        "attendance.index"
                                                    )}
                                                >
                                                    Attendance Tracking
                                                </Dropdown.Link>
                                            </>
                                        )}
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none "
                                            >
                                                {/* display user.photo */}
                                                <div>
                                                    <img
                                                        src={
                                                            "/storage/" +
                                                            user.photo
                                                        }
                                                        alt={user.name}
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                </div>

                                                {/* <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg> */}
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                    <ResponsiveNavLink
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard"
                                            )}
                                        >
                                            Dashboard
                                        </ResponsiveNavLink>
                                        {user.role === "admin" && (
                                            <>
                                                <ResponsiveNavLink
                                                    href={route("users.index")}
                                                    active={route().current(
                                                        "users.index"
                                                    )}
                                                >
                                                    Users
                                                </ResponsiveNavLink>

                                                <ResponsiveNavLink
                                                    href={route(
                                                        "departments.index"
                                                    )}
                                                    active={route().current(
                                                        "departments.index"
                                                    )}
                                                >
                                                    Departments
                                                </ResponsiveNavLink>

                                                <ResponsiveNavLink
                                                    href={route(
                                                        "coursesOfStudy.index"
                                                    )}
                                                    active={route().current(
                                                        "coursesOfStudy.index"
                                                    )}
                                                >
                                                    Courses of Study
                                                </ResponsiveNavLink>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "metrics.index"
                                                    )}
                                                    active={route().current(
                                                        "metrics.index"
                                                    )}
                                                >
                                                    Metrics
                                                </ResponsiveNavLink>
                                            </>
                                        )}

                                        <ResponsiveNavLink
                                            href={route("courses.index")}
                                            active={route().current(
                                                "courses.index"
                                            )}
                                        >
                                            Courses
                                        </ResponsiveNavLink>

                                        {(user.role == "admin" ||
                                            (user.role == "hod") |
                                                (user.role ==
                                                    "course_rep")) && (
                                            <>
                                                <ResponsiveNavLink
                                                    href={route(
                                                        "schedules.index"
                                                    )}
                                                    active={route().current(
                                                        "schedules.index"
                                                    )}
                                                >
                                                    Schedule
                                                </ResponsiveNavLink>

                                                <ResponsiveNavLink
                                                    href={route(
                                                        "attendance.index"
                                                    )}
                                                    active={route().current(
                                                        "attendance.index"
                                                    )}
                                                >
                                                    Attendance Tracking
                                                </ResponsiveNavLink>
                                            </>
                                        )}
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <img
                                src={"/storage/" + user.photo}
                                alt={user.name}
                                className="h-8 w-8 rounded-full"
                            />
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>
                {/* <SideBar /> */}

                {children}
            </main>
        </div>
    );
}
