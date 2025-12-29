import { ComponentType, Suspense } from 'react'
import Spinner from '@/shared/components/Spinner'

export const LazyRoute = ({
  Component,
  ...props
}: {
  Component: ComponentType<any>
}) => (
  <Suspense fallback={<Spinner />}>
    <Component {...props} />
  </Suspense>
)
