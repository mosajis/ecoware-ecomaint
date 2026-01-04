import { formatDateTime } from '@/core/api/helper'
import { atomLanguage } from '@/shared/atoms/general.atom'
import { useAtomValue } from 'jotai'
import { FC } from 'react'

type DateTimeType = 'DATE' | 'TIME' | 'DATETIME'

type CellDateTimeProps = {
  value?: string | Date | number | null
  type?: DateTimeType
  pattern?: string
  size?: 'small' | 'medium' | 'large'
}
const CellDateTime: FC<CellDateTimeProps> = ({
  value,
  type = 'DATETIME',
  pattern,
  size = 'small',
}) => {
  const lang = useAtomValue(atomLanguage) // 'en' | 'fa'

  if (!value) return '-'

  const formatted = formatDateTime(value, type, lang === 'fa', pattern)

  return formatted
}

export default CellDateTime
