'use client'

import { patientSchema } from '@/lib/schemas'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Field, FieldGroup, FieldLegend, FieldSet } from '@/shared/components/ui/field'
import { useState } from 'react'
import { useAppForm } from '../hooks/use-form'

interface FormProps {
  title: string
  type: 'update' | 'create'
}

const genderOptions = [
  {value: 'M', label: 'M'},
  {value: 'F', label: 'F'}
]

const PatientForm = ({ title, type }: FormProps) => {

  const [openDateCalendar, setOpenDateCalendar] = useState(false)
  const [openFurCalendar, setOpenFurCalendar] = useState(false)
  const [admissionDate, setAdmissionDate] = useState<Date>(new Date())
  const [furDate, setFurDate] = useState<Date | undefined>(new Date())

  const form = useAppForm({
    defaultValues: {
      legal_name: '',
      age: '',
      gender: 'M',
      date: admissionDate?.toISOString(),
      phone: '',
      address: '',
      occupation: '',
      responsible_person: '',
      relationship: '',
      fc_vital_signs: '',
      fr_vital_signs: '',
      t_vital_signs: '',
      p_a_vital_signs: '',
      sat_vital_signs: '',
      weight: '',
      height: '',
      consultation_reason: '',
      illness_history: '',
      medical_background: '',
      surgical_history: '',
      traumatic_history: '',
      allergy_history: '',
      g_gynecological_obstetric: '',
      p_gynecological_obstetric: '',
      c_gynecological_obstetric: '',
      ab_gynecological_obstetric: '',
      fur_gynecological_obstetric: furDate?.toISOString(),
      physical_exam: ''
    },
    validators: {
      onSubmit: patientSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    }
  })

  return (
    <Card className='w-full sm:max-w-3/4 mx-auto'>
      <CardHeader>
        <CardTitle className='text-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id='patient-form'
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldSet>
            <FieldLegend>DATOS GENERALES</FieldLegend>
            <FieldGroup>
              <form.AppField name='legal_name'>
                {(field) => <field.InputField label='Nombre'/>}
              </form.AppField>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                <form.AppField name='age'>
                  {(field) => <field.InputField label='Edad' description='Años'/>}
                </form.AppField>
                <form.AppField name='gender'>
                  {(field) => <field.SelectField label='Género' options={genderOptions}/>}
                </form.AppField>
                <form.AppField name='date'>
                  {(field) => <field.CalendarField
                    label='Fecha'
                    openDateCalendar={openDateCalendar}
                    setOpenDateCalendar={setOpenDateCalendar}
                    admissionDate={admissionDate}
                    setAdmissionDate={setAdmissionDate}
                  />}
                </form.AppField>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend>MOTIVO DE CONSULTA</FieldLegend>
            <form.AppField name='consultation_reason'>
              {(field) => <field.TextareaField label='Motivo de Consulta' className={'h-20'}/>}
            </form.AppField>
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation={'horizontal'} className='justify-center'>
          <Button
            type='submit'
            form='patient-form'
          >
            {type == 'create' ? 'REGISTRAR' : 'ACTUALIZAR'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}

export default PatientForm