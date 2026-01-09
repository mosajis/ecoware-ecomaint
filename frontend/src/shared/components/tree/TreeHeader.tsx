import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'
import TreeToolbar from './TreeToolbar'

// ===== TreeHeader =====
function TreeHeader({
  loading,
  onAdd,
  onRefresh,
  onExpandAll,
  onCollapseAll,
  onEdit,
  onDelete,
  onSearch,
  label,
  hasSelection,
}: {
  loading?: boolean
  label: string
  onAdd?: () => void
  onRefresh?: () => void
  onExpandAll?: () => void
  onCollapseAll?: () => void
  onDelete?: () => void
  onEdit?: () => void
  onSearch?: () => void
  hasSelection?: boolean // ✅ برای disable کردن دکمه‌ها
}) {
  return (
    <Box>
      <TreeToolbar
        hasSelection={hasSelection}
        label={label}
        onDelete={onDelete}
        onEdit={onEdit}
        onAdd={onAdd}
        onRefresh={onRefresh}
        onExpandAll={onExpandAll}
        onCollapseAll={onCollapseAll}
        onSearch={onSearch}
      />
      {loading && <LinearProgress />}
    </Box>
  )
}

export default TreeHeader
