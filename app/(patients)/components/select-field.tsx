import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useFieldContext } from '../hooks/use-form'

type SelectOption = {
  value: string
  label: string
}

type SelectFieldProps = {
  label: string
  options: SelectOption[]
  placeholder?: string
}

const SelectField = ({ label, options, placeholder }: SelectFieldProps) => {

  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select 
        defaultValue={placeholder}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value!)}
      >
        <SelectTrigger 
          id={field.name}
          aria-invalid={isInvalid}
        >
          <SelectValue placeholder={placeholder}/>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}

export default SelectField