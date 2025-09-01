import { createFileRoute } from '@tanstack/react-router'
import { initData } from '@telegram-apps/sdk-react'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  initData.restore()
  return <div>{initData.raw()}</div>
}
