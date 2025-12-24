import React, { useState } from 'react'
import {
  DialogContent,
  DialogActions,
  Box,
  Button,
  TextField,
} from '@mui/material'
import { useAtom } from 'jotai'
import { activeStepAtom } from './ReportWorkAtom'
import ReportWorkStepper from './reportWorkStepper'
import { reportWorkSteps } from './reportWorkSteps'
import AsyncSelect from '@/shared/components/AsyncSelect'
import { AsyncSelectField } from '@/shared/components/AsyncSelectField'
import {
  tblComponentUnit,
  TypeTblComponentUnit,
} from '@/core/api/generated/api'

interface ReportWorkStepProps {
  children: React.ReactNode
  disabled?: boolean
  onNext?: (nextStep: number) => void
  onPrev?: (prevStep: number) => void
  finishLabel?: string
}

const ReportWorkStep: React.FC<ReportWorkStepProps> = ({
  children,
  disabled = false,
  onNext,
  onPrev,
  finishLabel = 'Finish',
}) => {
  const totalSteps = reportWorkSteps.length
  const [componentUnit, setComponentUnit] =
    useState<TypeTblComponentUnit | null>(null)
  const [activeStep, setActiveStep] = useAtom(activeStepAtom)

  const handleNext = () => {
    if (activeStep < totalSteps - 1) {
      const nextStep = activeStep + 1
      setActiveStep(nextStep)
      onNext?.(nextStep)
    } else {
      onNext?.(activeStep)
    }
  }

  const handlePrev = () => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1
      setActiveStep(prevStep)
      onPrev?.(prevStep)
    }
  }

  return (
    <>
      <DialogContent
        dividers
        sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}
      >
        <ReportWorkStepper />
        <Box display={'grid'} gap={1.5} gridTemplateColumns={'1fr 1fr'}>
          <AsyncSelectField
            dialogMaxWidth='sm'
            label='Component'
            selectionMode='single'
            request={tblComponentUnit.getAll}
            getOptionLabel={row => row.compNo}
            value={componentUnit}
            onChange={r => setComponentUnit(r as any)}
            columns={[
              {
                field: 'compNo',
                headerName: 'Component',
                flex: 1,
              },
            ]}
            getRowId={row => row.compId}
          />
          <TextField
            fullWidth
            size='small'
            label='Job Title'
            slotProps={{ input: { readOnly: true } }}
          />
        </Box>
        {children}
      </DialogContent>

      <DialogActions>
        <Button onClick={handlePrev} disabled={activeStep === 0 || disabled}>
          Previous
        </Button>

        {activeStep === totalSteps - 1 ? (
          <Button variant='contained' onClick={handleNext} disabled={disabled}>
            {finishLabel}
          </Button>
        ) : (
          <Button variant='contained' onClick={handleNext} disabled={disabled}>
            Next
          </Button>
        )}
      </DialogActions>
    </>
  )
}

export default ReportWorkStep
