import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'
import { useFieldContext } from '../hooks/use-form'

type CalendarFieldProps = {
  label: string
  openCalendar: boolean
  setOpenCalendar: React.Dispatch<React.SetStateAction<boolean>>
  date: Date
  setDate: React.Dispatch<React.SetStateAction<Date>>
}

const CalendarField = ({ 
    label,
    openCalendar,
    setOpenCalendar,
    date,
    setDate
  }: CalendarFieldProps) => {

  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
        <PopoverTrigger render={
          <Button
            variant={'outline'}
            id={field.name}
            className='w-48 justify-between font-normal'
          >
            {date
              ? `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` 
              : 'Seleccionar fecha'}
            <ChevronDownIcon />
          </Button>
        }/>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            captionLayout='dropdown'
            onSelect={(date) => {
              setDate(date!)
              setOpenCalendar(false)
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