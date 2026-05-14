import { getSessionCached } from '@/lib/auth/session'
import AuthForm from '../components/auth-form'
import { redirect } from 'next/navigation'

const Login = async () => {

  const session = await getSessionCached()

  if(session) redirect('/org/redirect')

  return (
    <div className="w-full max-w-sm">
      <AuthForm />
    </div>
  )
}

export default Login