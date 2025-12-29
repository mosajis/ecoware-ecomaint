import { Suspense } from 'react'
import Spinner from '@/shared/components/Spinner'

export const LazyRoute = ({ Component }: { Component: any }) => (
  <Suspense fallback={<Spinner />}>
    <Component />
  </Suspense>
)
