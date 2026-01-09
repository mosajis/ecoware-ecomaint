import Box from '@mui/material/Box'
import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ToolbarButton from './toolbar/ToolbarButton'
import ButtonDensity from './toolbar/ButtonDensity'
import ButtonExport from './toolbar/ButtonExport'
import ButtonColumns from './toolbar/ButtonColumns'
import ButtonFilters from './toolbar/ButtonFilter'
import ButtonSearch from './toolbar/ButtonSearch'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import ConfirmDialog from '../ConfirmDialog'
import Divider from '@mui/material/Divider'
import { Toolbar } from '@mui/x-data-grid'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'

interface DataGridToolbarProps {
  label: string
  loading?: boolean
  onAddClick?: () => void
  onRefreshClick?: () => void
  onEditClick?: () => void
  onDeleteClick?: () => void
  hasSelection?: boolean

  disableSearch?: boolean
  disableDensity?: boolean
  disableExport?: boolean
  disableColumns?: boolean
  disableFilters?: boolean
  disableAdd?: boolean
  disableRefresh?: boolean
  disableEdit?: boolean
  disableDelete?: boolean

  children?: React.ReactNode
}

export default function DataGridToolbar(props: DataGridToolbarProps) {
  const theme = useTheme()

  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDeleteClick = () => {
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    setConfirmOpen(false)
    onDeleteClick?.()
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false)
  }

  const {
    label,
    loading,
    onAddClick,
    onRefreshClick,
    onEditClick,
    onDeleteClick,
    hasSelection,
    disableSearch,
    disableDensity,
    disableExport,
    disableColumns,
    disableFilters,
    disableAdd,
    disableRefresh,
    disableEdit,
    disableDelete,
    children,
  } = props

  return (
    <Box sx={{ width: '100%' }}>
      <Toolbar
        style={{
          display: 'flex',
          height: '45px',
          minHeight: '45px',
          paddingLeft: '.5rem',
          paddingRight: '.2rem',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        }}
      >
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <Typography fontWeight='bold'>{label}</Typography>

          {children}
        </Box>

        <Box display='flex' gap={0.5} alignItems={'center'}>
          {!disableSearch && <ButtonSearch />}
          <Divider
            orientation='vertical'
            style={{ color: 'red', height: 20 }}
          />
          {!disableDensity && <ButtonDensity />}
          {!disableExport && <ButtonExport />}
          {!disableColumns && <ButtonColumns />}
          {!disableFilters && <ButtonFilters />}
          <Divider
            orientation='vertical'
            style={{ color: 'red', height: 20 }}
          />
          {!disableEdit && onEditClick && (
            <ToolbarButton
              title='Edit'
              onClick={onEditClick}
              disabled={!hasSelection}
            >
              <EditIcon />
            </ToolbarButton>
          )}
          {!disableDelete && onDeleteClick && (
            <ToolbarButton
              title='Delete'
              onClick={handleDeleteClick}
              disabled={!hasSelection}
            >
              <DeleteIcon />
            </ToolbarButton>
          )}
          {!disableRefresh && onRefreshClick && (
            <ToolbarButton title='Refresh' onClick={onRefreshClick}>
              <RefreshIcon />
            </ToolbarButton>
          )}
          {!disableAdd && onAddClick && (
            <ToolbarButton title='Add' onClick={onAddClick}>
              <AddIcon />
            </ToolbarButton>
          )}
        </Box>
      </Toolbar>

      {loading && <LinearProgress />}

      <ConfirmDialog
        open={confirmOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Delete Item'
        message='Are you certain you want to delete this item?'
      />
    </Box>
  )
}
