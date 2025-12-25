import { FC } from 'react'

interface OverdueTextProps {
  value?: number | null
}

const OverdueText: FC<OverdueTextProps> = ({ value }) => {
  if (value == null) return null

  const color = value < 0 ? 'red' : 'green'

  return (
    <span
      style={{
        color,
        fontWeight: 600,
      }}
    >
      {value}
    </span>
  )
}

export default OverdueText
