"use client";

import { useRouter } from "next/navigation";

export default function OrgError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const isProvisionError = error.message.includes("provisioning");

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <span className="text-red-600 text-xl">✕</span>
        </div>
        <h1 className="mb-2 text-xl font-bold">
          {isProvisionError
            ? "Workspace setup failed"
            : "Something went wrong"}
        </h1>
        <p className="mb-6 text-gray-500">
          {isProvisionError
            ? "We couldn't create your database. This might be a temporary issue."
            : error.message}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Try again
          </button>
          <button
            onClick={() => router.push("/")}
            className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}