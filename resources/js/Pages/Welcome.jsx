import { Head, Link } from "@inertiajs/react";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div
                className="min-h-screen bg-cover bg-center flex flex-col text-white"
                style={{
                    backgroundImage: "url('/images/bg-pattern.jpg')",
                    backgroundAttachment: "fixed",
                    backgroundSize: "cover",    
                }}
            >
                {/* Overlay for glass effect */}
                <div className="bg-black/40 w-full h-full absolute inset-0 -z-10" />

                {/* Header */}
                <header className="backdrop-blur-md bg-white/10 shadow-md text-white py-4 px-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <h1 className="text-3xl font-bold tracking-wide">Evaluate</h1>
                        <nav className="space-x-4">
                            <Link
                                href={route("login")}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                            >
                                Log In
                            </Link>
                            {/* <Link
                                href={route("register")}
                                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg font-semibold"
                            >
                                Get Started
                            </Link> */}
                        </nav>
                    </div>
                </header>

                {/* Main Section */}
                <main className="flex-1 flex items-center justify-center px-4 py-12">
                    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 backdrop-blur-md bg-white/10 rounded-3xl shadow-xl p-8">
                        {/* Call to Action */}
                        <div className="flex flex-col justify-center space-y-6">
                            <h2 className="text-4xl font-bold">
                                Simplify Evaluations
                            </h2>
                            <p className="text-lg text-white/80">
                                Empower your institution with seamless lecturer evaluation. Modern, intuitive and built for real results.
                            </p>
                            <Link
                                href={route("register")}
                                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl text-lg font-semibold text-white transition shadow-lg"
                            >
                                Rate Your Lecturers
                            </Link>
                        </div>

                        {/* Cool Image */}
                        <div className="flex items-center justify-center">
                            <img
                                src="/images/evaluation-illustration.png"
                                alt="Illustration"
                                className="w-full max-w-md drop-shadow-lg"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="backdrop-blur-md bg-white/10 text-white text-center py-4 text-sm">
                    <p>&copy; 2025 Evaluate. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}
