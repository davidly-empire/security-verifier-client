'use client'

import React from 'react'

export default function SecurityInfoPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Security Information</h1>

      <p className="text-gray-600">
        This page will display security-related information such as:
      </p>

      <ul className="list-disc ml-6 mt-4 space-y-2 text-gray-700">
        <li>Guard profiles</li>
        <li>Shift details</li>
        <li>Assigned routes</li>
        <li>Security policies</li>
      </ul>
    </div>
  )
}
