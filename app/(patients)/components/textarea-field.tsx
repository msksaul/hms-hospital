import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'
import { Updater } from '@tanstack/react-form'
import { useFieldContext } from '../hooks/use-form'

type TextareaFieldProps = {
  label: string
  className: string
}

const TextareaField = ({ label, className }: TextareaFieldProps) => {

  const field = useFieldContext<string>()

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        className={className}
        name={field.name}
        value={field.state.value}
        onChange={(e: { target: { value: Updater<string> } }) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
      />
      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </Field>
  )
}

export default TextareaField