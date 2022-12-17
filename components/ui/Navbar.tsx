import ClearOutlined from '@mui/icons-material/ClearOutlined'
import MenuOutlined from '@mui/icons-material/MenuOutlined'
import SearchOutlined from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlined from '@mui/icons-material/ShoppingCartOutlined'

import {
  AppBar,
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Link,
  Toolbar,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'
import { CartContext, UiContext } from '../../context'

export const Navbar = () => {
  const router = useRouter()
  const { gender = '' } = router.query

  const { toggleSideMenu } = useContext(UiContext)
  const { itemsCount } = useContext(CartContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const handleSearch = () => {
    if (searchTerm.trim().length === 0) return
    router.push(`/search/${searchTerm.toLowerCase()}`)
    setSearchTerm('')
  }

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

        <Box
          className="fadeIn"
          sx={{
            display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' },
          }}
        >
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

        {/* desktop */}
        {isSearchVisible ? (
          <Input
            sx={{
              display: { xs: 'none', sm: 'flex' },
            }}
            className="fadeIn"
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
                    setIsSearchVisible(false)
                  }}
                >
                  <ClearOutlined />
                </IconButton>
              </InputAdornment>
            }
          />
        ) : (
          <IconButton
            sx={{ display: { xs: 'none', sm: 'flex' } }}
            className="fadeIn"
            onClick={() => {
              setIsSearchVisible(true)
            }}
          >
            <SearchOutlined />
          </IconButton>
        )}

        {/* small querys */}
        <IconButton
          sx={{ display: { xs: 'flex', sm: 'none' } }}
          onClick={toggleSideMenu}
        >
          <SearchOutlined />
        </IconButton>

        <NextLink href="/cart" passHref legacyBehavior>
          <Link>
            <IconButton>
              <Badge
                badgeContent={itemsCount > 9 ? '+9' : itemsCount}
                color="secondary"
              >
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
