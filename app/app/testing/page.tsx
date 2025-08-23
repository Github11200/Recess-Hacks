"use client";

import { Params } from "@/lib/interfaces";
import { useState } from "react";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScreenshot = async () => {
    setLoading(true);
    setError(null);
    setScreenshot(null);

    try {
      const params: Params = {
        location: "delta, bc",
        jobTitle: "software engineer",
      };
      const response = await fetch(`/api/getLinkedInData`, {
        body: JSON.stringify(params),
        method: "POST",
      })
        .then((data) => data.json())
        .then((res) => {
          console.log(res);
        });
      if (!response.ok) {
        throw new Error("Failed to capture screenshot.");
      }

      console.log(params);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Puppeteer on Vercel
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Enter a URL below to generate a screenshot using Puppeteer running in
          a Vercel Function.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://vercel.com"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:outline-none"
          />
          <button
            onClick={handleScreenshot}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Capturing..." : "Capture"}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {screenshot && (
          <div className="mt-8 border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <h2 className="text-2xl font-semibold p-4 bg-gray-100 border-b text-black">
              Screenshot Preview
            </h2>
            <img
              src={screenshot || "/placeholder.svg"}
              alt="Website screenshot"
              className="w-full"
            />
          </div>
        )}
      </div>
    </main>
  );
}
