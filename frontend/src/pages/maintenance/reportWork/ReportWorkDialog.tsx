import Dialog from '@mui/material/Dialog'
import Spinner from '@/shared/components/Spinner'
import DialogHeader from '@/shared/components/dialog/DialogHeader'
import { Suspense } from 'react'
import { reportWorkSteps } from './reportWorkSteps'
import { useAtom } from 'jotai'
import { activeStepAtom } from './ReportWorkAtom'
import { Box } from '@mui/material'

type Props = {
  open: boolean
  onClose: () => void
  componentUnitId?: number | null
  loading?: boolean
  disabled?: boolean
}

const ReportWorkDialog = ({
  open,
  onClose,
  componentUnitId,
  loading = false,
  disabled = false,
}: Props) => {
  const [activeStep, setActiveStep] = useAtom(activeStepAtom)

  const StepComponent = reportWorkSteps[activeStep].component

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <DialogHeader
        title='Report Work'
        onClose={onClose}
        loading={loading}
        disabled={disabled}
      />
      <Box height={'650px'} display='flex' flexDirection='column'>
        <Suspense fallback={<Spinner />}>
          <StepComponent selectedMaintLogId={componentUnitId} />
        </Suspense>
      </Box>
    </Dialog>
  )
}

export default ReportWorkDialog
