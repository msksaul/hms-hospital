'use client'

import { cn } from "@/lib/utils"
import { Field, FieldDescription, FieldGroup, FieldSeparator } from '@/shared/components/ui/field'
import { HeartPulseIcon } from "lucide-react"
import AuthButton from './auth-button'

export default function AuthForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-12 items-center justify-center rounded-md">
                <HeartPulseIcon className="size-12" />
              </div>
              <span className="sr-only">PMS Hospital</span>
            </a>
            <h1 className="text-xl font-bold">PMS Hospital</h1>
            <FieldDescription>
              Regístrate o inicia sesión
            </FieldDescription>
          </div>
          <FieldSeparator>-</FieldSeparator>
          <Field className="grid gap-4 sm:grid-cols-1">
            <AuthButton />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Necesitas una cuenta de Google para acceder a la aplicación.
      </FieldDescription>
    </div>
  )
}
