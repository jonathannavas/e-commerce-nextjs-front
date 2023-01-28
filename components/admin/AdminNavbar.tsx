import MenuOutlined from '@mui/icons-material/MenuOutlined'

import {
  AppBar,
  Box,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useContext } from 'react'
import { UiContext } from '../../context'

export const AdminNavbar = () => {
  const { toggleSideMenu } = useContext(UiContext)

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref legacyBehavior>
          <Link display="flex" alignItems="center">
            <Typography variant="h6">Teslo |</Typography>
            <Typography sx={{ ml: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>
        {/* todo flex */}
        <Box flex={1} />

        <IconButton
          onClick={toggleSideMenu}
          sx={{ marginLeft: { xs: 0, lg: 1 } }}
        >
          <MenuOutlined />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
