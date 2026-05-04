import PatientForm from '@/app/(main)/components/patient-form'
import { Suspense } from 'react'

const NewPatient = () => {
  return (  
    <Suspense fallback={<h1>Loading ...</h1>}>    
      <PatientForm title='HOJA DE DATOS' type='create'/>
    </Suspense>
  )
}

export default NewPatient