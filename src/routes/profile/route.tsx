import { createFileRoute, Outlet } from '@tanstack/react-router'
import { MarketTopBar } from '@/components/MarketHeader'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <MarketTopBar showSettings={true} />
      <Outlet />
    </>
  )
}