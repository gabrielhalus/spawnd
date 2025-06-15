import { RegisterForm } from '@/components/authentication/register-form'
import { createFileRoute } from '@tanstack/react-router'
import { Box } from 'lucide-react'

export const Route = createFileRoute('/_authentication/register')({
  component: Register,
})

function Register() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Box className="size-4" />
          </div>
          Spawnd.
        </a>
        <RegisterForm />
      </div>
    </div>
  )
}
