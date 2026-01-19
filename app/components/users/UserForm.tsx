'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { User, UserRole } from '@/app/types/user'
import RoleBadge from './RoleBadge'

interface UserFormProps {
  user: User | null
  onClose: () => void
  onSave: (data: Partial<User>) => void
  sites: string[]
  supervisors: User[]
}

export default function UserForm({
  user,
  onClose,
  onSave,
  sites,
  supervisors,
}: UserFormProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    email: '',
    phoneNumber: '',
    securityId: '', // ✅ ADDED
    role: 'Guard',
    assignedSite: sites[0] ?? '',
    assignedRoute: '',
    shiftTiming: '',
    supervisor: null,
    loginMethod: 'Email + Password',
    temporaryPassword: '',
    forcePasswordReset: false,
    employeeId: null,
    gpsValidationRequired: false,
    offlineScansAllowed: false,
    dashboardAccess: false,
    activityLogAccess: false,
    issueResolutionPermission: false,
  })

  useEffect(() => {
    if (user) {
      setFormData(user)
    }
  }, [user])

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    setFormData((prev: Partial<User>) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave(formData) // ✅ REMOVED status logic
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50">
      <div className="bg-white p-6 rounded-lg max-w-xl mx-auto mt-24">
        <h2 className="text-xl font-bold mb-4">
          {user ? 'Edit User' : 'Add User'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            value={formData.fullName ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Full Name"
          />

          {/* ✅ Security ID */}
          <input
            name="securityId"
            value={formData.securityId ?? ''}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Security ID"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Guard">Guard</option>
          </select>

          <RoleBadge role={formData.role as UserRole} />

          {/* ❌ Status (Active / Inactive) REMOVED */}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
