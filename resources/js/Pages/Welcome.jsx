import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-100 min-h-screen flex flex-col">
                {/* Header */}
                <header className="bg-blue-600 text-white py-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Eval</h1>
                        <nav>
                            <Link
                                href={route("login")}
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200"
                            >
                                Log In
                            </Link>
                            <Link
                                href={route("register")}
                                className="ml-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-200"
                            >
                                Register
                            </Link>
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="flex-1 flex items-center justify-center bg-blue-500 text-white">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            Welcome to Evaluate
                        </h2>
                        <p className="text-lg mb-6">
                            Simplify evaluation of your staff very efficiently.
                        </p>
                        <Link
                            href={route("register")}
                            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-200"
                        >
                            Get Started
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-12 bg-white">
                    <div className="container mx-auto text-center">
                        <h3 className="text-2xl font-bold mb-6">
                            Features You'll Love
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h4 className="text-xl font-semibold mb-2">
                                    Feature 1
                                </h4>
                                <p>
                                    Description of the first amazing feature of
                                    your app.
                                </p>
                            </div>
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h4 className="text-xl font-semibold mb-2">
                                    Feature 2
                                </h4>
                                <p>
                                    Description of the second amazing feature of
                                    your app.
                                </p>
                            </div>
                            <div className="p-6 bg-gray-100 rounded-lg shadow">
                                <h4 className="text-xl font-semibold mb-2">
                                    Feature 3
                                </h4>
                                <p>
                                    Description of the third amazing feature of
                                    your app.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-blue-600 text-white py-4">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2025 My App. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
