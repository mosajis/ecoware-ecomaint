import Editor from '@/shared/components/Editor'
import { TypeTblCompTypeJob } from '@/core/api/generated/api'

type Props = {
  compTypeJob?: TypeTblCompTypeJob
}

const TabJobDescription = ({ compTypeJob }: Props) => {
  return (
    <Editor
      readOnly
      key={compTypeJob?.compTypeJobId}
      label={compTypeJob?.tblJobDescription?.jobDescTitle || 'Job Description'}
      initValue={compTypeJob?.tblJobDescription?.jobDesc || ''}
    />
  )
}

export default TabJobDescription
