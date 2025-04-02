import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Create({ departments }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        code: "",
        department_id: "",
        description: "",
        duration_years: "",
        degree_type: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("coursesOfStudy.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Course of Study
                </h2>
            }
        >
            <Head title="Create Course of Study" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("coursesOfStudy.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Course of Study Creation Form */}
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
                            {/* <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Description"
                                />
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={data.description}
                                    onChange={(event, editor) => {
                                        const description = editor.getData();
                                        setData("description", description);
                                    }}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div> */}

                            {/* Duration (Years) Field */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="duration_years"
                                    value="Duration (Years)"
                                />
                                <TextInput
                                    id="duration_years"
                                    name="duration_years"
                                    type="number"
                                    max="10"
                                    min="1"
                                    step="1"
                                    value={data.duration_years}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData(
                                            "duration_years",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.duration_years}
                                    className="mt-2"
                                />
                            </div>

                            {/* Degree Type Field */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="degree_type"
                                    value="Degree Type"
                                />
                                <select
                                    id="degree_type"
                                    name="degree_type"
                                    value={data.degree_type}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) =>
                                        setData("degree_type", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select a Degree Type</option>
                                    <option value="BSc">BSc</option>
                                    <option value="BA">BA</option>
                                    <option value="MSc">MSc</option>
                                    <option value="PhD">PhD</option>
                                    <option value="Diploma">Diploma</option>
                                </select>
                                <InputError
                                    message={errors.degree_type}
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