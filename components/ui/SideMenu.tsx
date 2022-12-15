import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined'
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined'
import EscalatorWarningOutlined from '@mui/icons-material/EscalatorWarningOutlined'
import FemaleOutlined from '@mui/icons-material/FemaleOutlined'
import LoginOutlined from '@mui/icons-material/LoginOutlined'
import MaleOutlined from '@mui/icons-material/MaleOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined'

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { UiContext } from '../../context'

export const SideMenu = () => {
  const { isMenuOpen, toggleSideMenu } = useContext(UiContext)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState('')

  const handleNavigate = (toPath: string) => {
    toggleSideMenu()
    router.push(toPath)
  }

  const handleSearch = () => {
    if (searchTerm.trim().length === 0) return
    handleNavigate(`/search/${searchTerm.toLowerCase()}`)
    setSearchTerm('')
  }

  const textFieldInputFocus = (inputRef: any) => {
    if (inputRef && inputRef.node !== null) {
      setTimeout(() => {
        inputRef.focus()
      }, 100)
    }
    return inputRef
  }
  let textFieldProps = { inputRef: textFieldInputFocus }

  return (
    <Drawer
      open={isMenuOpen}
      onClose={toggleSideMenu}
      anchor="right"
      sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
    >
      <Box sx={{ width: 250, paddingTop: 5 }}>
        <List>
          <ListItem>
            <Input
              {...textFieldProps}
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => (e.key === 'Enter' ? handleSearch() : null)}
              type="text"
              placeholder="Buscar..."
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      handleSearch()
                    }}
                  >
                    <SearchOutlined />
                  </IconButton>
                </InputAdornment>
              }
            />
          </ListItem>

          <ListItemButton>
            <ListItemIcon>
              <AccountCircleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Perfil'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mis Ordenes'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => {
              handleNavigate('/category/men')
            }}
          >
            <ListItemIcon>
              <MaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Hombres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => {
              handleNavigate('/category/women')
            }}
          >
            <ListItemIcon>
              <FemaleOutlined />
            </ListItemIcon>
            <ListItemText primary={'Mujeres'} />
          </ListItemButton>

          <ListItemButton
            sx={{ display: { xs: '', sm: 'none' } }}
            onClick={() => {
              handleNavigate('/category/kid')
            }}
          >
            <ListItemIcon>
              <EscalatorWarningOutlined />
            </ListItemIcon>
            <ListItemText primary={'Niños'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <VpnKeyOutlined />
            </ListItemIcon>
            <ListItemText primary={'Ingresar'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <LoginOutlined />
            </ListItemIcon>
            <ListItemText primary={'Salir'} />
          </ListItemButton>

          {/* Admin */}
          <Divider />
          <ListSubheader>Admin Panel</ListSubheader>

          <ListItemButton>
            <ListItemIcon>
              <CategoryOutlined />
            </ListItemIcon>
            <ListItemText primary={'Productos'} />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ConfirmationNumberOutlined />
            </ListItemIcon>
            <ListItemText primary={'Ordenes'} />
          </ListItemButton>

          <ListItemButton>
            <ListItemIcon>
              <AdminPanelSettings />
            </ListItemIcon>
            <ListItemText primary={'Usuarios'} />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  )
}
