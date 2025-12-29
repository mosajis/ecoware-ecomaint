import Box, { BoxProps } from '@mui/material/Box'
import { ReactNode } from 'react'

interface BorderedBoxProps extends BoxProps {
  children: ReactNode
  label?: ReactNode
  direction?: 'row' | 'column'
  spacing?: number
}
export function BorderedBox({
  children,
  label,
  direction = 'row',
  spacing = 0.5,
  ...props
}: BorderedBoxProps) {
  return (
    <Box
      sx={(theme): any => ({
        width: '100%',
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        borderRadius: '8px',
        gap: spacing,
        ...props.sx,
      })}
      {...props}
    >
      {label && <Box fontWeight={'bold'}>{label}</Box>}
      {children}
    </Box>
  )
}
