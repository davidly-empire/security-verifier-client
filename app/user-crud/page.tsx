'use client'

import { useState } from 'react'
import UsersTable from '../components/users/UsersTable'
import UserForm from '../components/users/UserForm'
import UserFilters from '../components/users/UserFilters'

import { User, UserFiltersState, UserStatus } from '@/app/types/user'

/* ================= MOCK DATA ================= */

const initialUsers: User[] = [
  {
    id: 'USR001',
    fullName: 'John Smith',
    email: 'john.smith@example.com',
    phoneNumber: '+1 555-123-4567',
    role: 'Admin',
    status: 'Active',
    assignedSite: 'Headquarters',
    assignedRoute: 'All Sites',
    shiftTiming: '9:00 AM - 5:00 PM',
    supervisor: null,
    loginMethod: 'Email + Password',
    temporaryPassword: 'temp12345',
    forcePasswordReset: false,
    employeeId: null,
    gpsValidationRequired: null,
    offlineScansAllowed: null,
    dashboardAccess: true,
    activityLogAccess: true,
    issueResolutionPermission: true,
    lastLogin: new Date('2023-11-15T10:30:00'),
  },
]

const sites = [
  'All',
  'Headquarters',
  'North Facility',
  'South Facility',
  'East Facility',
  'West Facility',
]

/* ================= PAGE ================= */

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [filters, setFilters] = useState<UserFiltersState>({
    role: 'All',
    status: 'All',
    site: 'All',
  })

  /* ================= ACTIONS ================= */

  const handleAddUser = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    const normalizedStatus: UserStatus =
      userData.status === 'Inactive' ? 'Inactive' : 'Active'

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, ...userData, status: normalizedStatus }
            : u
        )
      )
    } else {
      const newUser: User = {
        ...(userData as User),
        id: `USR${String(users.length + 1).padStart(3, '0')}`,
        status: normalizedStatus,
        lastLogin: new Date(),
      }

      setUsers((prev) => [...prev, newUser])
    }

    setIsFormOpen(false)
    setEditingUser(null)
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    )
  }

  /* ================= FILTERING (OPTIONAL UI ONLY) ================= */

  const filteredUsers = users.filter((u) => {
    if (filters.role !== 'All' && u.role !== filters.role) return false
    if (filters.status !== 'All' && u.status !== filters.status) return false
    if (filters.site !== 'All' && u.assignedSite !== filters.site) return false
    return true
  })

  /* ================= UI ================= */

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Add User
        </button>
      </div>

      <UserFilters
        filters={filters}
        onFilterChange={setFilters}
        sites={sites}
      />

      <div className="bg-white shadow rounded-lg mt-4">
        <UsersTable
          users={filteredUsers}
          onEditUser={handleEditUser}
          onToggleUserStatus={handleToggleUserStatus}
        />
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveUser}
          sites={sites}
          supervisors={users.filter(
            (u) => u.role === 'Supervisor' && u.status === 'Active'
          )}
        />
      )}
    </div>
  )
}
