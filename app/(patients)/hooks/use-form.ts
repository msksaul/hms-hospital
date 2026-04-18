import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import InputField from '../components/input-field';
import SelectField from '../components/select-field';
import CalendarField from '../components/calendar-field';
import TextareaField from '../components/textarea-field';

export const { fieldContext, useFieldContext, formContext, useFormContext} = createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    InputField,
    SelectField,
    CalendarField,
    TextareaField
  },
  formComponents: {},
  fieldContext,
  formContext
})