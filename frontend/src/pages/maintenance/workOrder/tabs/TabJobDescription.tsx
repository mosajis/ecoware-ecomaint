import Editor from '@/shared/components/Editor'
import { TypeTblWorkOrderWithRels } from '../types'

interface Props {
  workOrder?: TypeTblWorkOrderWithRels | null
  label?: string
}

const TabJobDescription = ({ workOrder, label }: Props) => {
  const initValue = workOrder?.tblCompJob?.tblJobDescription?.jobDesc || ''

  return (
    <Editor label={label || 'Job Description'} initValue={initValue} readOnly />
  )
}

export default TabJobDescription
