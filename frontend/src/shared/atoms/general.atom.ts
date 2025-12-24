import { LOCAL_STORAGE } from '@/const'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

export const atomSideMenuOpen = atom(true)

export const atomLanguage = atomWithStorage<'en' | 'fa'>(
  LOCAL_STORAGE.LANG,
  'en'
)
