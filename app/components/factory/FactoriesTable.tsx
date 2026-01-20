'use client'

import { useEffect, useState } from 'react'
import { FactoryForm } from './FactoryForm'

interface Factory {
  id: string
  name: string
  location?: string
}

export const FactoriesTable = () => {
  const [factories, setFactories] = useState<Factory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')

  // Default to '/api' if NEXT_PUBLIC_API_URL is not set to avoid "undefined" URLs
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  // -----------------------
  // Load factories from backend
  // -----------------------
  const loadFactories = async () => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_BASE_URL}/factories`
      console.log(`Fetching from: ${url}`) // Debugging log
      
      const res = await fetch(url)
      
      // Check for HTTP errors (404, 500, etc.)
      if (!res.ok) {
        const errorText = await res.text() // Get raw error text if JSON isn't available
        console.error(`API Error ${res.status}:`, errorText)
        throw new Error(`Failed to fetch factories (Status: ${res.status})`)
      }

      const data = await res.json()

      // Validate that data is an array before mapping
      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data)
        throw new Error('Invalid data format received from server')
      }

      const normalized = data.map((f: any) => ({
        id: f.factory_code,
        name: f.factory_name,
        location: f.location || ''
      }))
      
      setFactories(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // -----------------------
  // Add new factory
  // -----------------------
  const addFactory = async (payload: { name: string; code: string; location?: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          factory_name: payload.name, 
          factory_code: payload.code,
          location: payload.location || ''
        }),
      })
      
      if (!res.ok) throw new Error(`Failed to create factory (Status: ${res.status})`)
      
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to add factory')
    }
  }

  // -----------------------
  // Start editing a row
  // -----------------------
  const startEdit = (factory: Factory) => {
    setEditingId(factory.id)
    setEditName(factory.name)
    setEditLocation(factory.location || '')
  }

  // -----------------------
  // Save edited factory
  // -----------------------
  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          factory_name: editName, 
          factory_code: id, 
          location: editLocation
        }),
      })
      
      if (!res.ok) throw new Error(`Failed to update factory (Status: ${res.status})`)
      
      setEditingId(null)
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update factory')
    }
  }

  // -----------------------
  // Delete factory
  // -----------------------
  const deleteFactory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this factory?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'DELETE'
      })
      
      // Note: 204 No Content is standard for DELETE, but checking !res.ok handles others
      if (!res.ok && res.status !== 204) throw new Error(`Failed to delete factory (Status: ${res.status})`)
      
      await loadFactories()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to delete factory')
    }
  }

  useEffect(() => {
    loadFactories()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // -----------------------
  return (
    <div className="space-y-4">
      <FactoryForm onSubmit={addFactory} />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500 italic">Loading factories...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Code</th>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Location</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {factories.length === 0 && !loading && !error ? (
              <tr>
                <td colSpan={4} className="text-center p-4 text-gray-500">
                  No factories found. Add one to get started.
                </td>
              </tr>
            ) : (
              factories.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-mono text-sm">{f.id}</td>

                  <td className="border border-gray-300 p-2">
                    {editingId === f.id ? (
                      <input 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      f.name
                    )}
                  </td>

                  <td className="border border-gray-300 p-2">
                    {editingId === f.id ? (
                      <input 
                        value={editLocation} 
                        onChange={(e) => setEditLocation(e.target.value)} 
                        className="border p-1 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    ) : (
                      f.location
                    )}
                  </td>

                  <td className="border border-gray-300 p-2 space-x-2">
                    {editingId === f.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(f.id)} 
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingId(null)} 
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(f)} 
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => deleteFactory(f.id)} 
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  )
}