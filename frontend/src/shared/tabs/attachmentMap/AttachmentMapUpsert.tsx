import { memo } from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import FormDialog from '@/shared/components/formDialog/FormDialog'
import ExistingAttachmentTab from './tabs/TabExisting'
import NewAttachmentTab from './tabs/TabNew'
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
      <Box height='400px'>
        <Tabs
          value={activeTab === 'existing' ? 0 : 1}
          onChange={(_, newValue) =>
            setActiveTab(newValue === 0 ? 'existing' : 'new')
          }
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 1 }}
        >
          <Tab label='Select Existing Attachment' />
          <Tab label='Upload New Attachment' />
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
