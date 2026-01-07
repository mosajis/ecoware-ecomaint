import { Split } from '@geoffcox/react-splitter'
import { useTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

import './Splitter.css'

interface SplitterProps {
  children: ReactNode[]
  horizontal?: boolean
  initialPrimarySize?: string
  resetOnDoubleClick?: boolean
  minPrimarySize?: string
  minSecondarySize?: string
  splitterSize?: string
}

const Splitter = ({
  children,
  horizontal = false,
  initialPrimarySize = '50%',
  resetOnDoubleClick = false,
  minPrimarySize,
  minSecondarySize,
  splitterSize,
  ...rest
}: SplitterProps) => {
  const theme = useTheme()

  const colors = {
    color: theme.palette.divider,
    hover: theme.palette.text.secondary,
    drag: theme.palette.primary.main,
  }

  return (
    <Split
      resetOnDoubleClick={true}
      horizontal={horizontal}
      initialPrimarySize={initialPrimarySize}
      minPrimarySize={minPrimarySize}
      minSecondarySize={minSecondarySize}
      splitterSize={splitterSize}
      defaultSplitterColors={colors}
      {...rest}
    >
      {children}
    </Split>
  )
}

export default Splitter
