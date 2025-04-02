import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        code: "",
        description: "",
        photo: null,
        department_id: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("courses.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Course
                </h2>
            }
        >
            <Head title="Create Course" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("courses.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Course Creation Form */}
                        <form onSubmit={submit}>
                            {/* Title Field */}
                            <div>
                                <InputLabel htmlFor="title" value="Title" />
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    autoComplete="title"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            {/* Code Field */}
                            <div className="mt-4">
                                <InputLabel htmlFor="code" value="Code" />
                                <TextInput
                                    id="code"
                                    name="code"
                                    value={data.code}
                                    className="mt-1 block w-full"
                                    autoComplete="code"
                                    onChange={(e) =>
                                        setData("code", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.code}
                                    className="mt-2"
                                />
                            </div>

                            {/* Department Selection */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="department_id"
                                    value="Department"
                                />
                                <select
                                    id="department_id"
                                    name="department_id"
                                    value={data.department_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) =>
                                        setData("department_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a Department</option>
                                    {departments.map((department) => (
                                        <option
                                            key={department.id}
                                            value={department.id}
                                        >
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.department_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Description Field */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    rows="4"
                                />
                                <InputError
                                    message={errors.description}
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
                                <InputError
                                    message={errors.photo}
                                    className="mt-2"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton
                                    className="ms-4"
                                    disabled={processing}
                                >
                                    Create
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}