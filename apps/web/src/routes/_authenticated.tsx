import { userQueryOptions } from '@/lib/api';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try { 
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data;
    } catch {
      return { user: null }
    }
  },
  component: Component,
})

function Component() {
  const { user } = Route.useRouteContext();
  
  if (!user) {
    return <Login />
  }

  return <Outlet />
}

function Login() {
  return "You have to login"
}
