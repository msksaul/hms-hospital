// app/org/[orgId]/org-shell.tsx

"use client";

import type { Permission, Role } from "@/types";
import { Suspense } from 'react';

interface OrgShellProps {
  children: React.ReactNode;
  orgId: string;
  role: Role;
  permissions: Permission[];
}

export function OrgShell({
  children,
  orgId,
  role,
  permissions,
}: OrgShellProps) {
  return (
    <Suspense fallback={<h1>Loading...</h1>}>
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="mb-4 text-lg font-bold">Organization</h2>
        <p className="mb-2 text-sm text-gray-500">Role: {role}</p>

        <nav className="space-y-1">
          <a
            href={`/org/${orgId}/patients`}
            className="block rounded px-3 py-2 text-sm hover:bg-gray-200"
          >
            Patients
          </a>
          {permissions.includes("settings:read") && (
            <a
              href={`/org/${orgId}/settings`}
              className="block rounded px-3 py-2 text-sm hover:bg-gray-200"
            >
              Settings
            </a>
          )}
          {permissions.includes("members:read") && (
            <a
              href={`/org/${orgId}/members`}
              className="block rounded px-3 py-2 text-sm hover:bg-gray-200"
            >
              Members
            </a>
          )}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
    </Suspense>
  );
}