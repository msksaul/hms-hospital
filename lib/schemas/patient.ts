import * as z from 'zod';

export const patientSchema = z.object({
  legal_name: z
    .string()
    .nonempty({ error: 'Indicar nombre' }),
  age: z
    .any()
    .superRefine((val, ctx) => {
      if(typeof val === 'string' && val.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Indicar edad'
        })
      }
    })
    .pipe(
      z.coerce.number({ error: 'Número inválido' })
        .int({ error: 'Edad inválida' })
        .nonnegative({ error: 'Edad inválida' })
    ),
  gender: z
    .enum(['M', 'F']),
  date: z
    .iso.datetime(),
  phone: z
    .any()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(
      z.coerce.number({ error: 'Teléfono inválido'})
      .int('Teléfono inválido')
      .refine(
        (num) => num.toString().length === 8,
        'Teléfono debe tener 8 dígitos'
      )
      .optional()
    ),
  address: z
    .string(),
  occupation: z
    .string(),
  responsible_person: z
    .string(),
  relationship: z
    .string(),
  fc_vital_signs: z
    .string(),
  fr_vital_signs: z
    .string(),
  t_vital_signs: z
    .string(),
  p_a_vital_signs: z
    .string(),
  sat_vital_signs: z
    .string(),
  weight: z
    .string(),
  height: z
    .string(),
  consultation_reason: z
    .string(),
  illness_history: z
    .string(),
  medical_background: z
    .string(),
  surgical_history: z
    .string(),
  traumatic_history: z
    .string(),
  allergy_history: z
    .string(),
  g_gynecological_obstetric: z
    .string(),
  p_gynecological_obstetric: z
    .string(),
  c_gynecological_obstetric: z
    .string(),
  ab_gynecological_obstetric: z
    .string(),
  fur_gynecological_obstetric: z
    .iso.datetime(),
  physical_exam: z
    .string()
})