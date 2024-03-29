import PeopleOutlined from '@mui/icons-material/PeopleOutlined'
import { Grid, MenuItem, Select } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { tesloApi } from '../../axiosApi'
import { AdminLayout } from '../../components/layouts/AdminLayout'
import { IUser } from '../../interfaces'

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users')
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) {
      setUsers(data)
    }
  }, [data])

  if (!data && !error) return <></>
  const handleUpdateRole = async (userId: string, newRole: string) => {
    const prevUsers = users.map((user) => ({ ...user }))
    const uptadedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }))

    setUsers(uptadedUsers)

    try {
      await tesloApi.put('/admin/users', { userId, role: newRole })
    } catch (error) {
      setUsers(prevUsers)
      console.log(error)
    }
  }

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            sx={{ width: '300px' }}
            onChange={({ target }) => handleUpdateRole(row.id, target.value)}
          >
            <MenuItem value={'admin'}>Administrador</MenuItem>
            <MenuItem value={'client'}>Cliente</MenuItem>
            <MenuItem value={'super-user'}>Super Usuario</MenuItem>
            <MenuItem value={'SEO'}>SEO</MenuItem>
          </Select>
        )
      },
    },
  ]

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }))

  return (
    <AdminLayout
      title="Usuarios"
      subTitle="Mantenimiento de usuarios"
      icon={<PeopleOutlined />}
    >
      <Grid container sx={{ mt: 2 }} className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export default UsersPage
