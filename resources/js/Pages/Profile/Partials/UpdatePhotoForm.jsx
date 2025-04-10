import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UpdatePhotoForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors } = useForm({
        photo: null,
    });

    const [preview, setPreview] = useState(user.photo ? `/storage/${user.photo}` : null);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setData('photo', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.photo.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Profile Photo</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your profile photo. A clear and professional photo is recommended.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col items-center">
                    {/* Photo Preview */}
                    {preview && (
                        <img
                            src={preview}
                            alt="Profile Preview"
                            className="w-32 h-32 rounded-full object-cover mb-4"
                        />
                    )}

                    {/* File Input */}
                    <div className="w-full">
                        <InputLabel htmlFor="photo" value="Upload Photo" />
                        <input
                            id="photo"
                            type="file"
                            className="block w-50 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-2"
                            onChange={handlePhotoChange}
                        />
                        <InputError message={errors.photo} className="mt-2" />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Upload</PrimaryButton>
                </div>
            </form>
        </section>
    );
}