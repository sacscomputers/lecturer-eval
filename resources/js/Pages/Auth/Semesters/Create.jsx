import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ academicYears }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        academic_year_id: "",
        start_date: "",
        end_date: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("semesters.store"));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Semesters / Create
                </h2>
            }
        >
            <Head title="Create Semester" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        {/* Back to Semesters List */}
                        <div className="flex justify-end mb-4">
                            <Link
                                href={route("semesters.index")}
                                className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-800 dark:bg-white dark:border-gray-700 dark:text-gray-900 dark:hover:bg-gray-200"
                            >
                                Back
                            </Link>
                        </div>

                        {/* Semester Creation Form */}
                        <form onSubmit={submit}>
                            {/* Name Field */}
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <select
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Semester</option>
                                    <option value="First">First</option>
                                    <option value="Second">Second</option>
                                </select>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Academic Year Field */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="academic_year_id"
                                    value="Academic Year"
                                />
                                <select
                                    id="academic_year_id"
                                    name="academic_year_id"
                                    value={data.academic_year_id}
                                    className="mt-1 block w-full rounded-lg"
                                    onChange={(e) =>
                                        setData(
                                            "academic_year_id",
                                            e.target.value
                                        )
                                    }
                                    required
                                >
                                    <option value="">
                                        Select an Academic Year
                                    </option>
                                    {academicYears.map((year) => (
                                        <option key={year.id} value={year.id}>
                                            {year.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError
                                    message={errors.academic_year_id}
                                    className="mt-2"
                                />
                            </div>

                            {/* Start Date Field */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="start_date"
                                    value="Start Date"
                                />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    name="start_date"
                                    value={data.start_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("start_date", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.start_date}
                                    className="mt-2"
                                />
                            </div>

                            {/* End Date Field */}
                            <div className="mt-4">
                                <InputLabel htmlFor="end_date" value="End Date" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    name="end_date"
                                    value={data.end_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("end_date", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.end_date}
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