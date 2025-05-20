import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Select from "react-select";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({ user, coursesOfStudy }) {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: user.name || "",
        email: user.email || "",
        roles: user.role_names || [],
        photo: null,
        matric_number: user.matric_number || "",
        level: user.level || "",
        course_of_study_id: user.course_of_study_id || "",
        staff_id: user.staff_id || "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("users.update", user.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit User
                </h2>
            }
        >
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("users.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                                as="button"
                            >
                                Back
                            </Link>
                        </div>

                        {/* User Edit Form */}
                        <form onSubmit={submit}>
                            {/* Name Field */}
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="mt-4">
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Role Selection */}
                            <div className="mt-4">
                                <InputLabel htmlFor="roles" value="Roles" />
                                <Select
                                    id="roles"
                                    isMulti // Allows multiple selections
                                    options={[
                                        { value: "admin", label: "Admin" },
                                        { value: "student", label: "Student" },
                                        {
                                            value: "lecturer",
                                            label: "Lecturer",
                                        },
                                        {
                                            value: "course rep",
                                            label: "Course Rep",
                                        },
                                        { value: "hod", label: "HOD" },
                                    ]}
                                    value={data.roles.map((role) => ({
                                        value: role,
                                        label: role,
                                    }))}
                                    onChange={(selectedOptions) =>
                                        setData(
                                            "roles",
                                            selectedOptions.map(
                                                (option) => option.value
                                            )
                                        )
                                    }
                                    className="mt-1 block w-full"
                                />
                                <InputError
                                    message={errors.roles}
                                    className="mt-2"
                                />
                            </div>

                            {/* Photo Upload */}
                            <div className="mt-4">
                                <InputLabel htmlFor="photo" value="Photo" />
                                <input
                                    id="photo"
                                    type="file"
                                    name="photo"
                                    onChange={(e) =>
                                        setData("photo", e.target.files[0])
                                    }
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2"
                                />
                                {progress && (
                                    <progress
                                        value={progress.percentage}
                                        max="100"
                                    >
                                        {progress.percentage}%
                                    </progress>
                                )}
                                <InputError
                                    message={errors.photo}
                                    className="mt-2"
                                />
                            </div>

                            {/* Student-Specific Fields */}
                            {(data.roles.includes("student") ||
                                data.roles.includes("course rep")) && (
                                <>
                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="matric_number"
                                            value="Matric Number"
                                        />
                                        <TextInput
                                            id="matric_number"
                                            name="matric_number"
                                            value={data.matric_number}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "matric_number",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        />
                                        <InputError
                                            message={errors.matric_number}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="level"
                                            value="Level"
                                        />
                                        <select
                                            id="level"
                                            name="level"
                                            value={data.level}
                                            className="mt-1 block w-full rounded-lg"
                                            onChange={(e) =>
                                                setData("level", e.target.value)
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select Level
                                            </option>
                                            <option value="100">100</option>
                                            <option value="200">200</option>
                                            <option value="300">300</option>
                                            <option value="400">400</option>
                                            <option value="500">500</option>
                                            <option value="600">600</option>
                                            <option value="700">700</option>
                                        </select>
                                        <InputError
                                            message={errors.level}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <InputLabel
                                            htmlFor="course_of_study_id"
                                            value="Course of Study"
                                        />
                                        <select
                                            id="course_of_study_id"
                                            name="course_of_study_id"
                                            value={data.course_of_study_id}
                                            className="mt-1 block w-full rounded-lg"
                                            onChange={(e) =>
                                                setData(
                                                    "course_of_study_id",
                                                    e.target.value
                                                )
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select a Course of Study
                                            </option>
                                            {coursesOfStudy.map((course) => (
                                                <option
                                                    key={course.id}
                                                    value={course.id}
                                                >
                                                    {course.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={errors.course_of_study_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Lecturer-Specific Fields */}
                            {(data.roles.includes("lecturer") ||
                                data.roles.includes("hod")) && (
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="staff_id"
                                        value="Staff ID"
                                    />
                                    <TextInput
                                        id="staff_id"
                                        name="staff_id"
                                        value={data.staff_id}
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("staff_id", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.staff_id}
                                        className="mt-2"
                                    />
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton
                                    className="ms-4"
                                    disabled={processing}
                                >
                                    Update
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
