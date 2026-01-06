import * as React from 'react'
import IconButton, { type IconButtonOwnProps } from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useAtom } from 'jotai'
import { atomLanguage } from '@/shared/atoms/general.atom'

export default function LanguageDropdown(props: IconButtonOwnProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [language, setLanguage] = useAtom(atomLanguage)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLanguage = (lang: 'fa' | 'en') => () => {
    setLanguage(lang)
    handleClose()
  }

  return (
    <>
      <IconButton onClick={handleClick} size='small' disableRipple {...props}>
        <Typography
          variant='body2'
          sx={{ fontWeight: 600, letterSpacing: 0.5 }}
        >
          {language === 'fa' ? 'FA' : 'EN'}
        </Typography>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            variant: 'outlined',
            elevation: 0,
            sx: { my: '4px', minWidth: 120 },
          },
        }}
      >
        <MenuItem
          selected={language === 'en'}
          onClick={handleChangeLanguage('en')}
        >
          English
        </MenuItem>
        <MenuItem
          selected={language === 'fa'}
          onClick={handleChangeLanguage('fa')}
        >
          Farsi
        </MenuItem>
      </Menu>
    </>
  )
}
