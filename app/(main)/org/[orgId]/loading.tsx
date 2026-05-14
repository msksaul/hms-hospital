// app/org/[orgId]/loading.tsx

export default function OrgLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
        <h1 className="mb-2 text-xl font-bold">Setting up your workspace</h1>
        <p className="text-gray-500">
          We&apos;re provisioning your database. This usually takes 5–10
          seconds.
        </p>
        <div className="mt-6 space-y-2 text-left max-w-xs mx-auto">
          <SetupStep label="Checking account" done />
          <SetupStep label="Verifying membership" done />
          <SetupStep label="Creating database" active />
          <SetupStep label="Almost ready" />
        </div>
      </div>
    </div>
  );
}

function SetupStep({
  label,
  done,
  active,
}: {
  label: string;
  done?: boolean;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {done && (
        <span className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
          ✓
        </span>
      )}
      {active && (
        <span className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      )}
      {!done && !active && (
        <span className="h-5 w-5 rounded-full bg-gray-200" />
      )}
      <span className={done ? "text-gray-500" : active ? "font-medium" : "text-gray-400"}>
        {label}
      </span>
    </div>
  );
}