'use client'

import { useAccount, useSwitchChain } from 'wagmi'
import { Button } from '@/components/ui/button'

export function NetworkSwitcher() {
  const { chain } = useAccount()
  const { chains, switchChain } = useSwitchChain()

  return (
    <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">
        Network Switcher
      </h3>
      <p className="text-gray-400 mb-2">
        当前链: <span>{chain?.name}</span>
      </p>
      <div className="flex flex-wrap gap-2">
        {chains.map(c => (
          <Button
            key={c.id}
            className="hover:cursor-pointer hover:bg-gray-800 text-xs px-2 py-1"
            onClick={() => switchChain({ chainId: c.id })}
          >
            {c.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
