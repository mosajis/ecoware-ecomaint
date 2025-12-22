import React, { useState } from 'react'
import { Button } from '@mui/material'
import ReportWorkDialog from './ReportWorkDialog'

type Props = {
  selectedMaintLogId?: number | null
}

const OpenReportWorkDialogButton = ({ selectedMaintLogId }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
        Report Work
      </Button>

      <ReportWorkDialog
        open={true}
        onClose={() => setOpen(false)}
        selectedMaintLogId={selectedMaintLogId}
      />
    </>
  )
}

export default OpenReportWorkDialogButton
