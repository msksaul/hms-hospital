import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { useFieldContext } from '../hooks/use-form'
import { Input } from '@/shared/components/ui/input'

type InputFieldProps = {
  label: string
  description?: string
}

const InputField = ({ label, description }: InputFieldProps) => {

  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        autoComplete="off"
      />
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}

export default InputField