import MenuOutlined from '@mui/icons-material/MenuOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'

import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { UiContext } from '../../context'

export const Navbar = () => {
  const router = useRouter()
  const { gender = '' } = router.query

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

        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <NextLink href="/category/men" passHref legacyBehavior>
            <Link>
              <Button color={`${gender === 'men' ? 'primary' : 'info'}`}>
                Hombres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/women" passHref legacyBehavior>
            <Link>
              <Button color={`${gender === 'women' ? 'primary' : 'info'}`}>
                Mujeres
              </Button>
            </Link>
          </NextLink>
          <NextLink href="/category/kid" passHref legacyBehavior>
            <Link>
              <Button color={`${gender === 'kid' ? 'primary' : 'info'}`}>
                Niños
              </Button>
            </Link>
          </NextLink>
        </Box>

        {/* todo flex */}
        <Box flex={1} />

        <IconButton>
          <SearchOutlined />
        </IconButton>
        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartOutlined />
              </Badge>
            </IconButton>
          </Link>
        </NextLink>
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
