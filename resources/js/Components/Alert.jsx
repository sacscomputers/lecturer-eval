import React, { useState } from "react";

export default function Alert({ type = "success", message }) {
    const [visible, setVisible] = useState(true);

    if (!visible || !message) return null;

    const alertStyles = {
        success: "bg-green-100 text-green-800 border-green-300",
        error: "bg-red-100 text-red-800 border-red-300",
        info: "bg-blue-100 text-blue-800 border-blue-300",
    };

    return (
        <div
            className={`p-4 mb-4 text-sm border rounded-lg ${alertStyles[type]}`}
            role="alert"
        >
            <span className="font-medium">{type === "success" ? "Success!" : type === "error" ? "Error!" : "Info:"}</span> {message}
            <button
                onClick={() => setVisible(false)}
                className="ml-4 text-sm text-gray-500 hover:text-gray-700"
            >
                Dismiss
            </button>
        </div>
    );
}