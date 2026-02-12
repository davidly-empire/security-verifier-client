'use client'

import { useState } from 'react'
import { deleteSecurityUser } from '../../api/securityUsers.api'
import { SecurityUser } from '@/app/types/securityUser'

/* ================= PROPS ================= */

interface UsersTableProps {
  users: SecurityUser[]
  onEditUser: (user: SecurityUser) => void
  onRefresh: () => Promise<void>
}

/* ================= COMPONENT ================= */

export default function UsersTable({
  users,
  onEditUser,
  onRefresh,
}: UsersTableProps) {

  const [visiblePasswords, setVisiblePasswords] =
    useState<Record<string, boolean>>({})

  /* ---------- Delete ---------- */

  const handleDelete = async (id: string) => {

    if (!confirm('Delete this user?')) return

    try {
      await deleteSecurityUser(id)
      await onRefresh()
    } catch (err) {
      alert('Delete failed')
    }
  }

  /* ---------- Toggle Password ---------- */

  const togglePassword = (id: string) => {
    setVisiblePasswords(prev => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  /* ================= UI ================= */

  return (
    <div className="overflow-x-auto bg-white rounded shadow">

      <table className="min-w-full border-collapse">

        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border text-left">ID</th>
            <th className="p-3 border text-left">Name</th>
            <th className="p-3 border text-left">Password</th>
            <th className="p-3 border text-left">Factory</th>
            <th className="p-3 border text-right">Actions</th>
          </tr>
        </thead>

        <tbody>

          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                No users found
              </td>
            </tr>
          )}

          {users.map((user) => (

            <tr
              key={user.security_id}
              className="hover:bg-gray-50"
            >

              <td className="p-3 border text-sm">
                {user.security_id}
              </td>

              <td className="p-3 border text-sm">
                {user.security_name}
              </td>

              <td className="p-3 border text-sm flex items-center gap-2">

                {visiblePasswords[user.security_id]
                  ? user.security_password ?? ''
                  : '******'}

                <span
                  className="cursor-pointer select-none"
                  onClick={() =>
                    togglePassword(user.security_id)
                  }
                >
                  {visiblePasswords[user.security_id]
                    ? '🙈'
                    : '👁️'}
                </span>

              </td>

              <td className="p-3 border text-sm">
                {user.factory}
              </td>

              <td className="p-3 border text-right text-sm space-x-3">

                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onEditUser(user)}
                >
                  Edit
                </button>

                <button
                  className="text-red-600 hover:underline"
                  onClick={() =>
                    handleDelete(user.security_id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}
