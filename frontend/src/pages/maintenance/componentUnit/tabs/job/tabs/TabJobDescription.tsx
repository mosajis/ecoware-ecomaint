import Editor from '@/shared/components/Editor'
import { TypeTblCompJob, TypeTblCompTypeJob } from '@/core/api/generated/api'

type Props = {
  compJob?: TypeTblCompJob | null
}

const TabJobDescription = ({ compJob }: Props) => {
  return (
    <Editor
      readOnly
      key={compJob?.compJobId}
      label={compJob?.tblJobDescription?.jobDescTitle || 'Job Description'}
      initValue={compJob?.tblJobDescription?.jobDesc || ''}
    />
  )
}

export default TabJobDescription
