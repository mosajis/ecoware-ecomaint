import { Box } from '@mui/material'
import { Tree } from 'react-complex-tree'

import 'react-complex-tree/lib/style-modern.css'

export default function CustomizedTree({ items }: any) {
  return (
    <Box>
      <Tree rootItem='' treeId='' />
    </Box>
  )
}
