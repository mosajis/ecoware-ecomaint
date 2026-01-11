import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import ExistingAttachmentTab from './tabs/TabExisting'
import NewAttachmentTab from './tabs/TabNew'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import UploadIcon from '@mui/icons-material/Upload'
import { memo } from 'react'
import { useAttachmentForm } from './useAttachmentForm'
import { BaseAttachmentUpsertProps } from './AttachmentType'

function AttachmentMapUpsert<T = any>({
  open,
  relationConfig,
  mapService,
  onClose,
  onSuccess,
}: BaseAttachmentUpsertProps<T>) {
  const {
    activeTab,
    setActiveTab,
    submitting,
    selectedAttachmentId,
    setSelectedAttachmentId,
    loadingAttachments,
    existingForm,
    newForm,
    handleExistingSubmit,
    handleNewSubmit,
  } = useAttachmentForm({
    open,
    relationConfig,
    mapService,
    onSuccess,
    onClose,
  })

  return (
    <FormDialog
      hideHeader
      open={open}
      maxWidth='sm'
      onClose={onClose}
      title='Add Attachment'
      submitting={submitting}
      loadingInitial={loadingAttachments}
      onSubmit={
        activeTab === 'existing'
          ? existingForm.handleSubmit(handleExistingSubmit)
          : newForm.handleSubmit(handleNewSubmit)
      }
    >
      <Box height='500px'>
        <Tabs
          value={activeTab === 'existing' ? 1 : 0}
          onChange={(_, newValue) =>
            setActiveTab(newValue === 1 ? 'existing' : 'new')
          }
        >
          <Tab
            label='New Attachment'
            icon={<UploadIcon fontSize='small' />}
            iconPosition='start'
          />
          <Tab
            label='Add Attachment'
            icon={<PlaylistAddCheckIcon />}
            iconPosition='start'
          />
        </Tabs>

        {activeTab === 'existing' && (
          <ExistingAttachmentTab onSelectionChange={setSelectedAttachmentId} />
        )}

        {activeTab === 'new' && (
          <NewAttachmentTab form={newForm} disabled={submitting} />
        )}
      </Box>
    </FormDialog>
  )
}

export default memo(AttachmentMapUpsert) as typeof AttachmentMapUpsert
