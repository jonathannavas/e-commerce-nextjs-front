import { Box, Typography } from '@mui/material'
import Head from 'next/head'
import { FC } from 'react'
import { AdminNavbar } from '../admin'
import { SideMenu } from '../ui'

interface Props {
  title: string
  subTitle: string
  icon?: JSX.Element
  children?: React.ReactNode
}

export const AdminLayout: FC<Props> = ({
  title = 'Panel Administrativo',
  children,
  subTitle,
  icon,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/* metatags */}
      <nav>
        <AdminNavbar />
      </nav>
      <SideMenu />
      {/* { set main info} */}
      <main
        style={{
          margin: '80px auto',
          maxWidth: '1440px',
          padding: '0px 30px',
        }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component={'h1'}>
            {icon}
            {title}
          </Typography>
          <Typography variant="h2" component={'h2'} sx={{ mb: 1 }}>
            {subTitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  )
}
