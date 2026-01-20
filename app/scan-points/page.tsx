'use client'

import { useEffect, useState } from 'react'
import { ScanPointsTable, ScanPoint } from '../components/scan/ScanPointsTable'
import { ScanPointForm } from '../components/scan/ScanPointForm'

import {
  getScanPointsByFactory,
  createScanPoint,
  updateScanPoint,
} from '../api/scanPoints.api'

/* ================= TYPES ================= */

interface Factory {
  id: string
  name: string
}

type StatusFilter = 'All' | 'Active' | 'Inactive'
type PriorityFilter = 'All' | 'Low' | 'Medium' | 'High'

export default function ScanPointsPage() {
  const [scanPoints, setScanPoints] = useState<ScanPoint[]>([])
  const [factories, setFactories] = useState<Factory[]>([])
  const [selectedFactory, setSelectedFactory] = useState<string>('')

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingScanPoint, setEditingScanPoint] = useState<ScanPoint | null>(null)

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All')

  /* ================= LOAD FACTORIES ================= */
  useEffect(() => {
    fetch('http://127.0.0.1:8000/factories/minimal')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        // SAFETY CHECK: Ensure data is an array before setting state
        const factoryArray = Array.isArray(data) ? data : []
        console.log('Loaded factories:', factoryArray)
        
        setFactories(factoryArray)
        
        // Only auto-select if we have factories
        if (factoryArray.length > 0) {
          setSelectedFactory(factoryArray[0].id)
        } else {
          setSelectedFactory('')
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to load factories:', err)
        // Ensure factories is always an empty array on error to prevent .map crash
        setFactories([]) 
      })
  }, [])

  /* ================= LOAD SCAN POINTS ================= */
  useEffect(() => {
    if (!selectedFactory) return

    getScanPointsByFactory(selectedFactory)
      .then((data: ScanPoint[]) => {
        setScanPoints(Array.isArray(data) ? data : [])
      })
      .catch((err: unknown) => {
        console.error('Failed to load scan points:', err)
        setScanPoints([])
      })
  }, [selectedFactory])

  /* ================= FILTER ================= */
  const visibleScanPoints = scanPoints.filter(sp => {
    if (statusFilter === 'Active' && !sp.is_active) return false
    if (statusFilter === 'Inactive' && sp.is_active) return false
    if (priorityFilter !== 'All' && sp.risk_level !== priorityFilter)
      return false
    return true
  })

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Scan Points</h1>
        <button
          onClick={() => {
            setEditingScanPoint(null)
            setIsFormOpen(true)
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Scan Point
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Factory:</label>
          <select
            value={selectedFactory}
            onChange={e => setSelectedFactory(e.target.value)}
            className="border p-2 rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={factories.length === 0}
          >
            {/* SAFETY FIX: Use (factories || []) to prevent crash if state isn't an array */}
            {(factories || []).map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
            {factories.length === 0 && (
              <option value="" disabled>No factories available</option>
            )}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as StatusFilter)}
            className="border p-2 rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700">Risk Level:</label>
          <select
            value={priorityFilter}
            onChange={e =>
              setPriorityFilter(e.target.value as PriorityFilter)
            }
            className="border p-2 rounded bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Risk Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <ScanPointsTable
        scanPoints={visibleScanPoints}
        onEdit={(sp: ScanPoint) => {
          setEditingScanPoint(sp)
          setIsFormOpen(true)
        }}
        onDisable={async (id: string) => {
          try {
            const updated = await updateScanPoint(id, { is_active: false })
            setScanPoints(prev =>
              prev.map(sp =>
                sp.id === id ? { ...sp, ...updated } : sp
              )
            )
          } catch (err: unknown) {
            console.error('Failed to disable scan point:', err)
          }
        }}
      />

      {/* FORM */}
      {isFormOpen && (
        <ScanPointForm
          scanPoint={editingScanPoint}
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (data: Partial<ScanPoint>) => {
            try {
              if (editingScanPoint) {
                const updated = await updateScanPoint(
                  editingScanPoint.id,
                  data
                )
                setScanPoints(prev =>
                  prev.map(sp =>
                    sp.id === editingScanPoint.id
                      ? { ...sp, ...updated }
                      : sp
                  )
                )
              } else {
                const created = await createScanPoint({
                  ...data,
                  factory_id: selectedFactory,
                })
                setScanPoints(prev => [...prev, created])
              }
            } catch (err: unknown) {
              console.error('Failed to save scan point:', err)
            } finally {
              setIsFormOpen(false)
              setEditingScanPoint(null)
            }
          }}
        />
      )}
    </div>
  )
}