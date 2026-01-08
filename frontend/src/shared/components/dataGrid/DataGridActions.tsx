import { useState, ReactNode } from 'react'
import Stack from '@mui/material/Stack'
import EditIcon from '@mui/icons-material/Edit'
import Eye from '@mui/icons-material/RemoveRedEye'
import DeleteIcon from '@mui/icons-material/Delete'
import DataGridActionsButton from './DataGridActionsButton'
import ConfirmDialog from '../ConfirmDialog'

interface DataGridActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  children?: ReactNode
}

export default function DataGridActions({
  onEdit,
  onDelete,
  children,
}: DataGridActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleDeleteClick = () => {
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    setConfirmOpen(false)
    onDelete?.()
  }

  const handleCancelDelete = () => {
    setConfirmOpen(false)
  }

  return (
    <>
      <Stack
        direction='row'
        spacing={0.5}
        display='flex'
        alignItems='center'
        height='100%'
      >
        {true && (
          <DataGridActionsButton
            title='Show'
            icon={<Eye fontSize='small' sx={{ color: '#4671b6ff' }} />}
            onClick={onEdit}
          />
        )}
        {onEdit && (
          <DataGridActionsButton
            title='Edit'
            icon={<EditIcon fontSize='small' sx={{ color: '#4671b6ff' }} />}
            onClick={onEdit}
          />
        )}

        {onDelete && (
          <DataGridActionsButton
            title='Delete'
            icon={<DeleteIcon fontSize='small' sx={{ color: '#be3c3cff' }} />}
            onClick={handleDeleteClick}
          />
        )}

        {children}
      </Stack>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='Delete Item'
        message='Are you certain you want to delete this item?'
      />
    </>
  )
}
