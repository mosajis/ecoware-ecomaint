import { Box, LinearProgress } from '@mui/material'
import TreeToolbar from './TreeToolbar'

// ===== TreeHeader =====
function TreeHeader({
  loading,
  onAdd,
  onRefresh,
  onExpandAll,
  onCollapseAll,
  label,
}: {
  loading?: boolean
  label: string
  onAdd?: () => void
  onRefresh?: () => void
  onExpandAll?: () => void
  onCollapseAll?: () => void
}) {
  return (
    <Box>
      <TreeToolbar
        label={label}
        onAdd={onAdd}
        onRefresh={onRefresh}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
      />
      {loading && <LinearProgress />}
    </Box>
  )
}

export default TreeHeader
