import { userQueryOptions } from '@/lib/api';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authentication')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;
    
    try {
      await queryClient.fetchQuery(userQueryOptions);
      return redirect({ to: "/" });
    }
    catch {
      return;
    }
  },
  component: AuthenticationLayout,
})

function AuthenticationLayout() {
  return <Outlet />
}
