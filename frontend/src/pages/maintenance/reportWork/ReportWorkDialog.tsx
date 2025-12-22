import React, { lazy, Suspense, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
} from '@mui/material'

import AccountTree from '@mui/icons-material/AccountTree'
import Build from '@mui/icons-material/Build'
import Inventory from '@mui/icons-material/Inventory'
import ReportProblem from '@mui/icons-material/ReportProblem'
import AttachFile from '@mui/icons-material/AttachFile'
import Straighten from '@mui/icons-material/Straighten'
import Spinner from '@/shared/components/Spinner'

// Lazy tabs
const TabGeneral = lazy(() => import('./tabs/TabGeneral'))
const TabResourceUsed = lazy(() => import('./tabs/TabResourceUsed'))
const TabStockUsed = lazy(() => import('./tabs/TabStockUsed'))
const TabAttachments = lazy(() => import('./tabs/TabAttachments'))
const TabMeasurePoints = lazy(() => import('./tabs/TabMeasurePoints'))

type StepItem = {
  label: string
  icon: React.ReactNode
  component: React.LazyExoticComponent<React.ComponentType<any>>
}

const steps: StepItem[] = [
  { label: 'Component', icon: <AccountTree />, component: TabGeneral },
  { label: 'General', icon: <AccountTree />, component: TabGeneral },
  { label: 'Resource Used', icon: <Build />, component: TabResourceUsed },
  { label: 'Stock Used', icon: <Inventory />, component: TabStockUsed },
  { label: 'Attachments', icon: <AttachFile />, component: TabAttachments },
  {
    label: 'Measure Points',
    icon: <Straighten />,
    component: TabMeasurePoints,
  },
]

type Props = {
  open: boolean
  onClose: () => void
  selectedMaintLogId?: number | null
}

const ReportWorkDialog = ({ open, onClose, selectedMaintLogId }: Props) => {
  const [activeStep, setActiveStep] = useState(0)

  const StepComponent = steps[activeStep].component

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogTitle>Report Work</DialogTitle>

      <DialogContent dividers>
        {/* Stepper */}
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(step => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box height={'600px'} mt={2}>
          <Suspense fallback={<Spinner />}>
            <StepComponent selectedMaintLogId={selectedMaintLogId} />
          </Suspense>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions>
        <Button onClick={handlePrev} disabled={activeStep === 0}>
          Previous
        </Button>

        {activeStep === steps.length - 1 ? (
          <Button variant='contained' color='primary' onClick={onClose}>
            Finish
          </Button>
        ) : (
          <Button variant='contained' onClick={handleNext}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ReportWorkDialog
