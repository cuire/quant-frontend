import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Page } from '@/components/Page'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  

  return (
    <Page>
      <Outlet />
    </Page>
  )
}
