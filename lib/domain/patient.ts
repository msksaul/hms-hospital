import { PERMISSIONS } from "@/lib/rbac/permissions";
import { requirePermission } from "@/lib/guards/require-permission";
import { patients } from "@/db/org/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { AccessContext, OrgDb } from '@/types';

/**
 * List all patients in the org.
 */
export async function listPatients(
  orgDb: OrgDb,
  access: AccessContext
) {
  requirePermission(access, PERMISSIONS.patients.read);

  const result = await orgDb.select().from(patients).all();
  return result;
}

/**
 * Get a single patient by ID.
 */
export async function getPatient(
  orgDb: OrgDb,
  access: AccessContext,
  patientId: string
) {
  requirePermission(access, PERMISSIONS.patients.read);

  const result = await orgDb
    .select()
    .from(patients)
    .where(eq(patients.id, patientId))
    .get();

  return result;
}

/**
 * Create a new patient.
 */
export async function createPatient(
  orgDb: OrgDb,
  access: AccessContext,
  data: {
    firstName: string;
    lastName: string;
    email?: string;
    dateOfBirth?: string;
    phone?: string;
    notes?: string;
  }
) {
  requirePermission(access, PERMISSIONS.patients.write);

  const now = new Date();
  const [patient] = await orgDb
    .insert(patients)
    .values({
      id: nanoid(),
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return patient;
}

/**
 * Delete a patient.
 */
export async function deletePatient(
  orgDb: OrgDb,
  access: AccessContext,
  patientId: string
) {
  requirePermission(access, PERMISSIONS.patients.delete);

  await orgDb.delete(patients).where(eq(patients.id, patientId));
}