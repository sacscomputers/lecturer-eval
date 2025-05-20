import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

export default function Dashboard({ summary }) {
    const user = usePage().props.auth.user;
    const resources = [
        {
            title: "Users",
            count: summary.users,
            link: route("users.index"),
            color: "bg-blue-500",
            icon: "👤",
        },
        {
            title: "Courses",
            count: summary.courses,
            link: route("courses.index"),
            color: "bg-green-500",
            icon: "📘",
        },
        // {
        //     title: "Lecturers",
        //     count: summary.lecturers,
        //     link: route("users.index"),
        //     color: "bg-yellow-500",
        //     icon: "🎓",
        // },
        {
            title: "Metrics",
            count: summary.metrics,
            link: route("metrics.index"),
            color: "bg-red-500",
            icon: "🎒",
        },
        {
            title: "Departments",
            count: summary.departments,
            link: route("departments.index"),
            color: "bg-purple-500",
            icon: "🏢",
        },
        {
            title: "Schedules",
            count: summary.schedules,
            link: route("schedules.index"),
            color: "bg-pink-500",
            icon: "📅",
        },
        {
            title: "Attendances",
            count: summary.attendances,
            link: route("attendance.index"),
            color: "bg-indigo-500",
            icon: "✅",
        },
        {
            title: "Evaluations",
            count: summary.evaluations,
            link: route("evaluations.index"),
            color: "bg-teal-500",
            icon: "📊",
        },
    ];
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                        {user.role == "admin" && (
                            <div
                                className="py-12"
                                style={{
                                    backgroundImage:
                                        "url('/images/bg-pattern.jpg')",
                                    backgroundAttachment: "fixed",
                                    backgroundSize: "cover",
                                }}
                            >
                                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
                                        {resources.map((resource, index) => (
                                            <div
                                                key={index}
                                                className={`${resource.color} text-white p-6 rounded-lg shadow-lg flex flex-col items-center bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-50 border border-gray-100`}
                                            >
                                                <div className="text-4xl">
                                                    {resource.icon}
                                                </div>
                                                <div className="text-2xl font-bold mt-4">
                                                    {resource.count}
                                                </div>
                                                <div className="text-lg mt-2">
                                                    {resource.title}
                                                </div>
                                                <Link
                                                    href={resource.link}
                                                    className="mt-4 bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
                                                >
                                                    View {resource.title}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
