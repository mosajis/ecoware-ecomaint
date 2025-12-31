import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import DataGridActionsButton from '../dataGrid/DataGridActionsButton'
import { getDesignTokens } from '@/shared/theme/themePrimitives'
import { styled, useColorScheme } from '@mui/material/styles'
import { TreeItem, treeItemClasses, type TreeItemProps } from '@mui/x-tree-view'
import { memo } from 'react'
import { useDoubleClick } from '@/shared/hooks/useDoubleClick'

export const StyledTreeItem = styled(TreeItem)(({ theme }) => {
  const { mode } = useColorScheme()

  return {
    position: 'relative',

    [`& .${treeItemClasses.content}`]: {
      position: 'relative',
      padding: theme.spacing(0.3, 1),
      margin: theme.spacing(0.3, 0),
      '&::before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: -18,
        width: 18,
        height: 1,
        // @ts-ignore
        borderBottom: `1px dashed ${getDesignTokens(mode).palette.grey[300]}`,
      },
    },

    [`& .${treeItemClasses.iconContainer}`]: {
      opacity: 0,
      width: 0,
      ':has(svg)': {
        opacity: 1,
        width: 'auto',
      },
    },

    [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 15,
      paddingLeft: 18,
      // @ts-ignore
      borderLeft: `1px dashed ${getDesignTokens(mode).palette.grey[300]}`,
    },
  }
})

interface CustomLabelProps {
  label: string
  id: string
  onEditClick?: (id: string) => void
  onDeleteClick?: (id: string) => void
  onDoubleClick?: (id: string) => void
}

const CustomLabel = memo(
  function CustomLabel({
    label,
    id,
    onEditClick,
    onDeleteClick,
    onDoubleClick,
  }: CustomLabelProps) {
    const { onClick } = useDoubleClick({
      onDoubleClick: () => {
        onDoubleClick?.(id)
      },
      delay: 300,
    })

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onClick={onClick}
      >
        <Typography sx={{ flex: 1 }}>{label}</Typography>

        <Box display={'flex'} gap={0.5}>
          {onEditClick && (
            <DataGridActionsButton
              title='Edit'
              icon={<EditIcon fontSize='small' sx={{ color: '#4671b6ff' }} />}
              onClick={e => {
                e.stopPropagation()
                onEditClick?.(id)
              }}
            />
          )}

          {onDeleteClick && (
            <DataGridActionsButton
              title='Delete'
              icon={<DeleteIcon fontSize='small' sx={{ color: '#be3c3cff' }} />}
              onClick={e => {
                e.stopPropagation()
                onDeleteClick?.(id)
              }}
            />
          )}
        </Box>
      </Box>
    )
  },
  (prev, next) =>
    prev.label === next.label &&
    prev.id === next.id &&
    prev.onEditClick === next.onEditClick &&
    prev.onDeleteClick === next.onDeleteClick &&
    prev.onDoubleClick === next.onDoubleClick
)

function CustomTreeItemBase(
  props: TreeItemProps & {
    onEditClick?: (id: string) => void
    onDeleteClick?: (id: string) => void
    onDoubleClick?: (id: string) => void
  }
) {
  const { itemId, label, onEditClick, onDeleteClick, onDoubleClick, ...other } =
    props

  return (
    <StyledTreeItem
      itemId={itemId}
      label={
        <CustomLabel
          id={itemId!}
          label={label as string}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onDoubleClick={onDoubleClick}
        />
      }
      {...other}
    />
  )
}

export default memo(CustomTreeItemBase)
