import { useState, useCallback, useMemo, memo } from 'react'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ReactNode } from 'react'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen'
import RefreshIcon from '@mui/icons-material/Refresh'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ButtonSearch from './toolbar/ButtonSearch'

interface TreeToolbarProps {
  label?: string
  onExpandAll?: () => void
  onCollapseAll?: () => void
  onFilter?: () => void
  onSearch?: (value: string) => void
  onRefresh?: () => void
  onAdd?: () => void
  onEdit?: () => void
  onDelete?: () => void
  hasSelection?: boolean // برای enable/disable کردن edit و delete
  actions?: ReactNode
}

interface ActionButton {
  key: string
  icon: ReactNode
  tooltip: string
  onClick?: () => void
  disabled?: boolean
  show: boolean
}

const TreeToolbar = memo(function TreeToolbar({
  label,
  onExpandAll,
  onCollapseAll,
  onSearch,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  hasSelection = false,
  actions,
}: TreeToolbarProps) {
  const [searchText, setSearchText] = useState('')

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchText(value)
      onSearch?.(value)
    },
    [onSearch]
  )

  // بهینه‌سازی: sx object را با useMemo کش می‌کنیم
  const boxSx = useMemo(
    () => (theme: any) => ({
      padding: '3.5px 0.2rem',
      paddingLeft: '.4rem',
      borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
      backgroundColor: (theme.vars || theme).palette.background.paper,
      borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
    []
  )

  // بهینه‌سازی: آرایه دکمه‌ها برای جلوگیری از تکرار کد
  const buttons: ActionButton[] = useMemo(
    () => [
      {
        key: 'expand',
        icon: <OpenInFullIcon />,
        tooltip: 'Expand',
        onClick: onExpandAll,
        show: !!onExpandAll,
      },
      {
        key: 'collapse',
        icon: <CloseFullscreenIcon />,
        tooltip: 'Collapse',
        onClick: onCollapseAll,
        show: !!onCollapseAll,
      },
      {
        key: 'edit',
        icon: <EditIcon />,
        tooltip: 'Edit',
        onClick: onEdit,
        disabled: !hasSelection,
        show: !!onEdit,
      },
      {
        key: 'delete',
        icon: <DeleteIcon />,
        tooltip: 'Delete',
        onClick: onDelete,
        disabled: !hasSelection,
        show: !!onDelete,
      },
      {
        key: 'refresh',
        icon: <RefreshIcon />,
        tooltip: 'Refresh',
        onClick: onRefresh,
        show: !!onRefresh,
      },
      {
        key: 'add',
        icon: <AddIcon />,
        tooltip: 'Add',
        onClick: onAdd,
        show: !!onAdd,
      },
    ],
    [
      onExpandAll,
      onCollapseAll,
      onEdit,
      onDelete,
      onRefresh,
      onAdd,
      hasSelection,
    ]
  )

  return (
    <Box>
      <Box sx={boxSx}>
        <Typography fontWeight='bold'>{label}</Typography>

        <Stack direction='row' spacing={0.5} alignItems='center'>
          {onSearch && <ButtonSearch onSearch={handleSearchChange} />}

          {/* {buttons.map(
            btn =>
              btn.show && (
                <Tooltip key={btn.key} title={btn.tooltip}>
                  <IconButton
                    size='small'
                    onClick={btn.onClick}
                    disabled={btn.disabled}
                  >
                    {btn.icon}
                  </IconButton>
                </Tooltip>
              )
          )} */}

          {actions && <Box>{actions}</Box>}
        </Stack>
      </Box>
    </Box>
  )
})

export default TreeToolbar
