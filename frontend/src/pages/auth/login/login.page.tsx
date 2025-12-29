import LockOutlinedIcon from '@mui/icons-material/Lock'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AccountCircle from '@mui/icons-material/AccountCircle'
import LoginInfoPanel from './components/loginPanel'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import { LOCAL_STORAGE } from '@/const'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { login } from '../auth.api'
import { IconButton, useColorScheme } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'

// 🧩 Zod schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: true,
    },
  })

  const { mode, setMode } = useColorScheme()

  const toggleTheme = () => {
    if (!mode) return
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const res = await login(data)

      if (res?.accessToken) {
        localStorage.setItem(LOCAL_STORAGE.ACCESS_KEY, res.accessToken)
        toast.success('Logged in successfully!')
        navigate({ to: '/' })
      } else {
        toast.error('Login failed.')
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'An error occurred while logging in.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      display='grid'
      gridTemplateColumns={{
        md: '1fr',
        lg: '9fr 11fr',
      }}
      minHeight='100vh'
    >
      <Box
        display='flex'
        justifyContent='center'
        flexDirection='column'
        p='4rem'
        position={'relative'}
      >
        <Box
          display='flex'
          justifyContent='flex-end'
          mb={2}
          position={'absolute'}
          top={20}
          right={50}
        >
          <IconButton onClick={toggleTheme} color='inherit'>
            {mode === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>
        </Box>
        <Box>
          <Box pb={4}>
            <Box fontSize='1.8rem' fontWeight='bold'>
              Sign In
            </Box>
            <Box color='#5a5a5a' fontWeight='medium'>
              Access your preventive maintenance dashboard
            </Box>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display='flex' flexDirection='column' gap={1.5}>
              {/* Username */}
              <TextField
                label='Username'
                placeholder='Enter your username'
                fullWidth
                {...register('username')}
                error={!!errors.username}
                helperText={errors.username?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccountCircle color='action' />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {/* Password */}
              <TextField
                label='Password'
                type={showPassword ? 'text' : 'password'}
                fullWidth
                placeholder='••••••••'
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <LockOutlinedIcon color='action' />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={() => setShowPassword(!showPassword)}
                        display='flex'
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Box>
                    ),
                  },
                }}
              />

              <Button
                type='submit'
                variant='contained'
                color='secondary'
                disabled={loading}
                sx={{ mt: 0 }}
              >
                {loading ? 'Signing In...' : 'SIGN IN'}
              </Button>

              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
              >
                <FormControlLabel
                  sx={{ m: 0, gap: 1 }}
                  control={<Checkbox {...register('remember')} />}
                  label='Remember me'
                />
                <Link
                  href='#'
                  underline='hover'
                  sx={{ fontSize: '0.9rem', color: 'secondary.main' }}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>

      <LoginInfoPanel />
    </Box>
  )
}
