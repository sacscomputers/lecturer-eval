import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function Create() {
    const { data, setData, post, processing, errors, progress } = useForm({
        name: "",
        code: "",
        // photo: null,
        description: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("departments.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Department
                </h2>
            }
        >
            <Head title="Create Department" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back Button */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("departments.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Department Creation Form */}
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

                            {/* Photo Upload */}
                            {/* <div className="mt-4">
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
                            </div> */}

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
                                        const data = editor.getData();
                                        setData("description", data);
                                    }}
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div> */}

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