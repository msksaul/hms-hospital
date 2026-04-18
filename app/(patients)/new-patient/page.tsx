import { Suspense } from 'react'
import PatientForm from '../components/patient-form'

const NewPatient = () => {
  return (  
    <Suspense fallback={<h1>Loading ...</h1>}>    
      <PatientForm title='HOJA DE DATOS' type='create'/>
    </Suspense>
  )
}

export default NewPatient