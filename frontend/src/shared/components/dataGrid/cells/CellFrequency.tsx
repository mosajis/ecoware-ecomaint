import { TypeTblPeriod } from '@/core/api/generated/api'
import { FC } from 'react'

type Props = {
  frequency?: number | null
  frequencyPeriod?: TypeTblPeriod | null
}

const CellFrequency: FC<Props> = ({ frequency, frequencyPeriod }) => {
  if (frequency == null) return '-'

  const formatted = `${frequency} ${frequencyPeriod?.name || '-'}`
  return formatted
}

export default CellFrequency
