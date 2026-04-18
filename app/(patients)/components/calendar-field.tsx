import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { useFieldContext } from '../hooks/use-form'

type CalendarFieldProps = {
  label: string
  openDateCalendar: boolean
  setOpenDateCalendar: React.Dispatch<React.SetStateAction<boolean>>
  admissionDate: Date
  setAdmissionDate: React.Dispatch<React.SetStateAction<Date>>
}

const CalendarField = ({ 
    label,
    openDateCalendar,
    setOpenDateCalendar,
    admissionDate,
    setAdmissionDate
  }: CalendarFieldProps) => {

  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover open={openDateCalendar} onOpenChange={setOpenDateCalendar}>
        <PopoverTrigger render={
          <Button
            variant={'outline'}
            id={field.name}
            className='w-48 justify-between font-normal'
          >
            {admissionDate
              ? `${admissionDate.getDate()}/${admissionDate.getMonth()}/${admissionDate.getFullYear()}` 
              : 'Seleccionar fecha'}
            <ChevronDownIcon />
          </Button>
        }/>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={admissionDate}
            captionLayout='dropdown'
            onSelect={(date) => {
              setAdmissionDate(date!)
              setOpenDateCalendar(false)
              field.handleChange(date!.toISOString())
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}

export default CalendarField