import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Bold,
    Essentials,
    Italic,
    Paragraph,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

export default function Edit({ department }) {
    const { data, setData, put, processing, errors, progress } = useForm({
        name: department.name || "",
        code: department.code || "",
        // photo: null,
        description: department.description || "",
    });

    const submit = (e) => {
        e.preventDefault();

        put(route("departments.update", department.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Courses / Edit
                </h2>
            }
        >
            <Head title="Edit Course" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Link to go back to departments list */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("departments.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200 me-2 mb-2"
                                as="button"
                            >
                                Back
                            </Link>
                        </div>
                        {/* Course edit form */}
                        <div className="mt-8 sm:mx-auto sm:w-full">
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="name" value="Title" />

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
                                        message={errors.title}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="code" value="Code" />

                                    <TextInput
                                        id="code"
                                        type="text"
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

                                {/* add input for photo */}
                                {/* <div className="mt-4">
                                    <InputLabel
                                        htmlFor="photo"
                                        value="Photo"
                                        className=""
                                    />

                                    <input
                                        id="photo"
                                        type="file"
                                        name="photo"
                                        onChange={(e) =>
                                            setData("photo", e.target.files[0])
                                        }
                                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2"
                                        aria-describedby="file_input_help"
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

                                {/* select element for user roles */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="description"
                                        value="Description"
                                    />
                                    <CKEditor
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full rounded-lg"
                                        onChange={(event, editor) =>
                                            setData(
                                                "description",
                                                editor.getData()
                                            )
                                        }
                                        required
                                        editor={ClassicEditor}
                                        config={{
                                            licenseKey:
                                                'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NzQzOTY3OTksImp0aSI6IjA3ODdhODg3LTljMDktNDc1NC1hZDk1LWZjYzdkYTM2N2I4YSIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIl0sInZjIjoiNDNkMDNlNjkifQ.EmMz1tGwqzlqEmAj-N6HHJnxkpCIDtZjaRdIoPO8zgkPro77nOCN-RuJnPhtNwGdFZFnURTVieb3-ZNyF_2N1Q',
                                            plugins: [
                                                Essentials,
                                                Paragraph,
                                                Bold,
                                                Italic,
                                            ],
                                            toolbar: [
                                                "undo",
                                                "redo",
                                                "|",
                                                "bold",
                                                "italic",
                                                "|",
                                            ],
                                            initialData: data.description,
                                        }}
                                        onReady={ ( editor ) => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log( 'Editor 1 is ready to use!', editor );
                                          } }
                                    />

                                    <InputError
                                        message={errors.description}
                                        className="mt-2"
                                    />
                                </div>

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
            </div>
        </AuthenticatedLayout>
    );
}