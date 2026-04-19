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
  const [furDate, setFurDate] = useState<Date>(new Date())

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
      onChange: patientSchema,
      onChangeAsyncDebounceMs: 3000
      
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
          <FieldSet className='pb-4'>
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
                    openCalendar={openDateCalendar}
                    setOpenCalendar={setOpenDateCalendar}
                    date={admissionDate}
                    setDate={setAdmissionDate}
                  />}
                </form.AppField>
                <form.AppField name='phone'>
                  {(field) => <field.InputField label='Teléfono' description='Ej. 42425549'/>}
                </form.AppField>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <form.AppField name='address'>
                  {(field) => <field.InputField label='Dirección'/>}
                </form.AppField>
                <form.AppField name='occupation'>
                  {(field) => <field.InputField label='Ocupación'/>}
                </form.AppField>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <form.AppField name='responsible_person'>
                  {(field) => <field.InputField label='Persona responsable'/>}
                </form.AppField>
                <form.AppField name='relationship'>
                  {(field) => <field.InputField label='Parentesco'/>}
                </form.AppField>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>SIGNOS VITALES</FieldLegend>
            <FieldGroup>
              <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
                <form.AppField name='fc_vital_signs'>
                  {(field) => <field.InputField label='FC'/>}
                </form.AppField>
                <form.AppField name='fr_vital_signs'>
                  {(field) => <field.InputField label='FR'/>}
                </form.AppField>
                <form.AppField name='t_vital_signs'>
                  {(field) => <field.InputField label='T'/>}
                </form.AppField>
                <form.AppField name='p_a_vital_signs'>
                  {(field) => <field.InputField label='P/A'/>}
                </form.AppField>
                <form.AppField name='weight'>
                  {(field) => <field.InputField label='Peso'/>}
                </form.AppField>
                <form.AppField name='height'>
                  {(field) => <field.InputField label='Talla'/>}
                </form.AppField>
                <form.AppField name='sat_vital_signs'>
                  {(field) => <field.InputField label='SAT'/>}
                </form.AppField>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>MOTIVO DE CONSULTA</FieldLegend>
            <form.AppField name='consultation_reason'>
              {(field) => <field.TextareaField className={'h-20'}/>}
            </form.AppField>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>HISTORIA DE LA ENFERMEDAD</FieldLegend>
            <form.AppField name='consultation_reason'>
              {(field) => <field.TextareaField className={'h-20'}/>}
            </form.AppField>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>ANTECEDENTES</FieldLegend>
            <form.AppField name='medical_background'>
              {(field) => <field.TextareaField label='Médicos' className={'h-10'}/>}
            </form.AppField>
            <form.AppField name='surgical_history'>
              {(field) => <field.TextareaField label='Quirúrgicos' className={'h-10'}/>}
            </form.AppField>
            <form.AppField name='traumatic_history'>
              {(field) => <field.TextareaField label='Traumáticos' className={'h-10'}/>}
            </form.AppField>
            <form.AppField name='allergy_history'>
              {(field) => <field.TextareaField label='Alérgicos' className={'h-10'}/>}
            </form.AppField>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>GINECO OBSTÉTRICOS</FieldLegend>
            <div className='grid grid-cols-2 sm:grid-cols-5 gap-4'>
              <form.AppField name='g_gynecological_obstetric'>
                {(field) => <field.InputField label='G'/>}
              </form.AppField>
              <form.AppField name='p_gynecological_obstetric'>
                {(field) => <field.InputField label='P'/>}
              </form.AppField>
              <form.AppField name='c_gynecological_obstetric'>
                {(field) => <field.InputField label='C'/>}
              </form.AppField>
              <form.AppField name='ab_gynecological_obstetric'>
                {(field) => <field.InputField label='AB'/>}
              </form.AppField>
              <form.AppField name='fur_gynecological_obstetric'>
                {(field) => <field.CalendarField
                  label='FUR'
                  openCalendar={openFurCalendar}
                  setOpenCalendar={setOpenFurCalendar}
                  date={furDate}
                  setDate={setFurDate}
                />}
              </form.AppField>
            </div>
          </FieldSet>
          <FieldSet className='pb-4'>
            <FieldLegend>EXAMEN FÍSICO</FieldLegend>
            <form.AppField name='physical_exam'>
              {(field) => <field.TextareaField className={'h-30'}/>}
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