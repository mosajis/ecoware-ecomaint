import { Stepper, Step, StepLabel } from '@mui/material'
import { reportWorkSteps } from './reportWorkSteps'
import { useAtomValue } from 'jotai'
import { atomActiveStep } from './ReportWorkAtom'

const ReportWorkStepper = () => {
  const activeStep = useAtomValue(atomActiveStep)

  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {reportWorkSteps.map(step => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

export default ReportWorkStepper
