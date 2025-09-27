'use client'

import { useState } from 'react'
import { parseEther } from 'viem'
import { Input } from '@/components/ui/input'

interface ETHConverterProps {
  value: string
  onChange: (value: string) => void
}

export function ETHConverter({ value, onChange }: ETHConverterProps) {
  let weiValue: string | null = null
  try {
    if (value) {
      weiValue = parseEther(value).toString()
    }
  } catch {
    weiValue = 'Invalid input'
  }

  return (
    <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">
        Convert ETH → Wei
      </h3>
      <Input
        placeholder="Enter ETH amount"
        className="bg-gray-900 border-gray-700 text-white"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <p className="mt-2 text-xs text-gray-400 break-all">{weiValue}</p>
      )}
    </div>
  )
}
