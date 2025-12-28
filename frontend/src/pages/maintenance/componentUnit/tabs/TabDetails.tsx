import Editor from '@/shared/components/Editor'
import { useEditor } from '@/shared/hooks/useEditor'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

interface TabDetailsProps {
  componentUnit?: TypeTblComponentUnit | null
  label?: string | null
}

const TabDetails = ({ label, componentUnit }: TabDetailsProps) => {
  const { data, loading, save } = useEditor({
    id: componentUnit?.compId,
    fetcher: tblComponentUnit.getById,
    updater: tblComponentUnit.update,
  })

  return (
    <Editor
      readOnly={!!componentUnit?.compId}
      label={label || 'Details'}
      initValue={data?.notes}
      autoSave
      loading={loading}
      onSave={value => save({ notes: value })}
    />
  )
}

export default TabDetails
