import { memo } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import ExistingAttachmentTab from './tabs/TabExisting'
import NewAttachmentTab from './tabs/TabNew'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import UploadIcon from '@mui/icons-material/Upload'
import { useAttachmentForm } from './useAttachmentForm'
import { BaseAttachmentUpsertProps } from './AttachmentType'
import { Add, Check } from '@mui/icons-material'

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
    attachments,
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
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 1,
            bgcolor: 'white',
          }}
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
          <ExistingAttachmentTab
            attachments={attachments}
            loading={loadingAttachments}
            selectedAttachmentId={selectedAttachmentId}
            onSelectionChange={setSelectedAttachmentId}
          />
        )}

        {activeTab === 'new' && (
          <NewAttachmentTab form={newForm} disabled={submitting} />
        )}
      </Box>
    </FormDialog>
  )
}

export default memo(AttachmentMapUpsert) as typeof AttachmentMapUpsert
