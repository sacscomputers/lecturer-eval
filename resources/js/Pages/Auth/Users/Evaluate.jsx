import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { Head, useForm } from "@inertiajs/react";

export default function Evaluate({ lecturer, metrics }) {
    const { data, setData, post, processing, errors } = useForm({
        scores: {},
    });

    const handleScoreChange = (metricId, value) => {
        setData("scores", {
            ...data.scores,
            [metricId]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("lecturers.evaluate", lecturer.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Evaluate Lecturer
                </h2>
            }
        >
            <Head title="Evaluate Lecturer" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* Lecturer Details */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <div className="flex items-center space-x-4">
                            <img
                                src={`/storage/${lecturer.photo}`}
                                alt={lecturer.name}
                                className="h-24 w-24 rounded-full"
                            />
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                    {lecturer.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {lecturer.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Evaluation Form */}
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <form onSubmit={submit}>
                            <h3 className="text-lg font-semibold mb-4">
                                Evaluation Metrics
                            </h3>
                            {metrics.map((metric) => (
                                <div key={metric.id} className="mb-4">
                                    <label
                                        htmlFor={`metric-${metric.id}`}
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        <span
                                            className="underline cursor-pointer"
                                            title={metric.description}
                                        >
                                            {metric.name}
                                        </span>
                                    </label>
                                    <div className="flex items-center space-x-2 mt-1">
                                        {[...Array(metric.rating)].map(
                                            (_, index) => (
                                                <label
                                                    key={index + 1}
                                                    className="cursor-pointer"
                                                >
                                                    <input
                                                        type="radio"
                                                        name={`metric-${metric.id}`}
                                                        value={index + 1}
                                                        checked={
                                                            data.scores[
                                                                metric.id
                                                            ] == index + 1
                                                        }
                                                        onChange={(e) =>
                                                            handleScoreChange(
                                                                metric.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="hidden"
                                                    />
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill={
                                                            data.scores[
                                                                metric.id
                                                            ] >= index + 1
                                                                ? "gold"
                                                                : "none"
                                                        }
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        className="w-8 h-8 text-yellow-500"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.122 6.564a1 1 0 00.95.69h6.905c.969 0 1.371 1.24.588 1.81l-5.59 4.066a1 1 0 00-.364 1.118l2.122 6.564c.3.921-.755 1.688-1.54 1.118l-5.59-4.066a1 1 0 00-1.176 0l-5.59 4.066c-.784.57-1.838-.197-1.54-1.118l2.122-6.564a1 1 0 00-.364-1.118L2.98 11.99c-.783-.57-.38-1.81.588-1.81h6.905a1 1 0 00.95-.69l2.122-6.564z"
                                                        />
                                                    </svg>
                                                </label>
                                            )
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        Selected Score:{" "}
                                        {data.scores[metric.id] || 0} /{" "}
                                        {metric.rating}
                                    </div>
                                    <InputError
                                        message={errors[`scores.${metric.id}`]}
                                        className="mt-2"
                                    />
                                </div>
                            ))}

                            {/* Submit Button */}
                            <div className="mt-4 flex items-center justify-end">
                                <PrimaryButton
                                    className="ms-4"
                                    disabled={processing}
                                >
                                    Submit Evaluation
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}