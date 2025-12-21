import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { useNavigate, useRouter } from '@tanstack/react-router'

export function NotFound() {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <Box
      minHeight='100vh'
      display='flex'
      alignItems='center'
      justifyContent='center'
      px={2}
    >
      <Stack spacing={2} alignItems='center' maxWidth={420}>
        <Box display={'flex'} alignItems={'center'} gap={4}>
          {/* Icon */}
          <ErrorOutlineIcon
            sx={{
              fontSize: 72,
              color: 'text.secondary',
            }}
          />
          <Box>
            {/* Title */}
            <Typography variant='h2' fontWeight={700} color='text.secondary'>
              404
            </Typography>

            <Typography variant='h6' color='text.secondary'>
              Page not found
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              The page you’re looking for doesn’t exist or has been moved.
            </Typography>
          </Box>
        </Box>
        <Divider flexItem />

        {/* Actions */}
        <Stack direction='row' spacing={2} width={'100%'}>
          <Button
            sx={{ flex: 1 }}
            variant='contained'
            size='large'
            onClick={() => navigate({ to: '/' })}
          >
            Go to Home
          </Button>

          <Button
            sx={{ flex: 1 }}
            variant='outlined'
            size='large'
            color='inherit'
            onClick={() => navigate({ to: router.history.back() })}
          >
            Go Back
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
