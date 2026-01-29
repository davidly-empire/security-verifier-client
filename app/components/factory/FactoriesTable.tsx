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
  
  // Local state for inline editing
  const [editName, setEditName] = useState('')
  const [editLocation, setEditLocation] = useState('')

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

  /* ================= API HANDLERS ================= */
  
  const loadFactories = async () => {
    setLoading(true)
    setError('')
    try {
      const url = `${API_BASE_URL}/factories`
      console.log(`Fetching from: ${url}`) 
      
      const res = await fetch(url)
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error(`API Error ${res.status}:`, errorText)
        throw new Error(`Failed to fetch factories (Status: ${res.status})`)
      }

      const data = await res.json()

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

  const startEdit = (factory: Factory) => {
    setEditingId(factory.id)
    setEditName(factory.name)
    setEditLocation(factory.location || '')
  }

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

  const deleteFactory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this factory?')) return
    try {
      const res = await fetch(`${API_BASE_URL}/factories/${id}`, {
        method: 'DELETE'
      })
      
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

  /* ================= UI COMPONENTS ================= */

  // Professional Input for Inline Editing
  const InlineInput = ({ value, onChange, placeholder }: { value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <input 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
      autoFocus
    />
  )

  // Premium Action Button Group
  const EditActions = ({ onSave, onCancel }: { onSave: () => void, onCancel: () => void }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={onSave} 
        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-md shadow-sm transition-colors flex items-center gap-1"
      >
        Save
      </button>
      <button 
        onClick={onCancel} 
        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-md transition-colors"
      >
        Cancel
      </button>
    </div>
  )

  // Standard Action Button Group
  const RowActions = ({ onEdit, onDelete }: { onEdit: () => void, onDelete: () => void }) => (
    <div className="flex items-center gap-2">
      <button 
        onClick={onEdit} 
        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Edit
      </button>
      <button 
        onClick={onDelete} 
        className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Delete
      </button>
    </div>
  )

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      
      {/* FORM SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Factory</h3>
        <FactoryForm onSubmit={addFactory} />
      </div>

      {/* ERROR ALERT */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <strong className="font-bold">System Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        </div>
      )}

      {/* TABLE SECTION */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* TABLE HEADER */}
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Factory Code</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Factory Name</th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="bg-white divide-y divide-slate-100">
              {factories.length === 0 && !error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-slate-50 p-3 rounded-full mb-3">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <p className="text-sm font-medium text-slate-600">No factories found</p>
                      <p className="text-xs text-slate-400">Use the form above to add your first factory.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                factories.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                    {/* ID Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-mono font-bold text-blue-600 bg-blue-50 rounded border border-blue-100">
                        {f.id}
                      </span>
                    </td>

                    {/* Name Column */}
                    <td className="px-6 py-4">
                      {editingId === f.id ? (
                        <InlineInput 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)} 
                          placeholder="Factory Name"
                        />
                      ) : (
                        <span className="text-sm font-medium text-slate-800">{f.name}</span>
                      )}
                    </td>

                    {/* Location Column */}
                    <td className="px-6 py-4">
                      {editingId === f.id ? (
                        <InlineInput 
                          value={editLocation} 
                          onChange={(e) => setEditLocation(e.target.value)} 
                          placeholder="Location"
                        />
                      ) : (
                        <span className="text-sm text-slate-600">{f.location || "—"}</span>
                      )}
                    </td>

                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === f.id ? (
                        <EditActions 
                          onSave={() => saveEdit(f.id)} 
                          onCancel={() => setEditingId(null)} 
                        />
                      ) : (
                        <RowActions 
                          onEdit={() => startEdit(f)} 
                          onDelete={() => deleteFactory(f.id)} 
                        />
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}