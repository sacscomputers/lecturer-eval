import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import DataTable from "react-data-table-component";

export default function Index({ users, roles, levels, coursesOfStudy }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const { delete: destroy } = useForm();
    const { data, setData, post } = useForm({
        file: null,
    });

    const [search, setSearch] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCourseOfStudy, setSelectedCourseOfStudy] = useState("");
    console.log(users);
    // Filtered users based on search and filters
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = selectedRole ? user.role == selectedRole : true;
        const matchesLevel = selectedLevel ? user.level == selectedLevel : true;
        const matchesCourseOfStudy = selectedCourseOfStudy
            ? user.course_of_study_id == selectedCourseOfStudy
            : true;

        return matchesSearch && matchesRole && matchesLevel && matchesCourseOfStudy;
    });

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Photo",
            selector: (row) => (
                <img
                    src={"/storage/" + row.photo}
                    alt={row.name}
                    className="h-8 w-8 rounded-full"
                />
            ),
        },
        {
            name: "Name",
            selector: (row) => row.name,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Role",
            selector: (row) => row.role,
        },
        {
            name: "Level",
            selector: (row) => row.level || "N/A",
        },
        {
            name: "Course of Study",
            selector: (row) => row.course_of_study?.name || "N/A",
        },
        {
            name: "Action",
            selector: (row) => (
                <>
                    <Link
                        href={route("users.show", row.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                        View
                    </Link>
                    <Link
                        href={route("users.edit", row.id)}
                        className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => openModal(row)}
                        className="text-red-600 hover:text-red-900"
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ];

    function submit(e) {
        e.preventDefault();
        post("/users/bulk-upload");
    }

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const handleDelete = () => {
        destroy(route("users.destroy", selectedUser.id), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Users
                </h2>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Bulk Upload and Create User */}
                        <div className="flex justify-between items-center mb-4">
                            {/* Bulk Upload Users */}
                            <form
                                onSubmit={submit}
                                className="flex items-center gap-2"
                            >
                                <input
                                    className="text-sm text-gray-900 border border-gray-300 rounded-l-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 px-3 py-2"
                                    type="file"
                                    onChange={(e) =>
                                        setData("file", e.target.files[0])
                                    }
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition"
                                >
                                    Bulk Upload
                                </button>
                            </form>

                            {/* Create User Button */}
                            <Link
                                href={route("users.create")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Create User
                            </Link>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex flex-wrap gap-4 mb-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/3"
                            />

                            {/* Filter by Role */}
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
                            >
                                <option value="">All Roles</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>

                            {/* Filter by Level */}
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
                            >
                                <option value="">All Levels</option>
                                {levels.map((level) => (
                                    <option key={level} value={level}>
                                        {level}
                                    </option>
                                ))}
                            </select>

                            {/* Filter by Course of Study */}
                            <select
                                value={selectedCourseOfStudy}
                                onChange={(e) =>
                                    setSelectedCourseOfStudy(e.target.value)
                                }
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:w-1/4"
                            >
                                <option value="">All Courses of Study</option>
                                {coursesOfStudy.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Users list */}
                        <DataTable
                            columns={columns}
                            data={filteredUsers}
                            direction="auto"
                            fixedHeaderScrollHeight="300px"
                            pagination
                            responsive
                            subHeaderAlign="right"
                            subHeaderWrap
                        />
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