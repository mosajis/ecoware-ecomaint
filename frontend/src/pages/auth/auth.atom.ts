import { atom } from 'jotai'
import type { TypeTblUsers } from '@/core/api/generated/api'

// Your auth atom
type TypeAuth = {
  authorized: boolean
  user: null | TypeTblUsers
}
export const atomAuth = atom<TypeAuth>({
  authorized: false,
  user: null,
})

// Derived atom to get the user
export const atomUser = atom(get => {
  const auth = get(atomAuth)
  return auth.user
})
