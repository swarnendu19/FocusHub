import React from 'react';

// Simple test component to check if basic rendering works
export function TestLeaderboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Test Leaderboard
            </h1>
            <p className="text-gray-600">
                This is a simple test component to verify rendering works.
            </p>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">
                    If you can see this, the basic component rendering is working!
                </p>
            </div>
        </div>
    );
}