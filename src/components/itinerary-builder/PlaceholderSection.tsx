"use client";
import React from "react";
export default function PlaceholderSection({ title }: { title: string }) {
    return (
        <div className="p-8 text-center border border-dashed border-gray-600 rounded-xl">
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400">This section is under construction.</p>
        </div>
    );
}
