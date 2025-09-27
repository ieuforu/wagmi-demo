'use client'

import { useState, useEffect } from 'react'
import { useSignMessage } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface MessageSignerProps {
  onSignature?: (signature: string, message: string) => void
}

export function MessageSigner({ onSignature }: MessageSignerProps) {
  const [message, setMessage] = useState('')
  const [signature, setSignature] = useState('')
  const [signingStatus, setSigningStatus] = useState<
    'idle' | 'signing' | 'success' | 'error'
  >('idle')

  const {
    signMessage,
    isLoading: signing,
    data,
    isError,
    error,
  } = useSignMessage()

  // 监听签名结果
  useEffect(() => {
    if (data && signingStatus === 'signing') {
      setSignature(data)
      setSigningStatus('success')
      onSignature?.(data, message)
    }
  }, [data, signingStatus, onSignature])

  // 监听错误
  useEffect(() => {
    if (isError && signingStatus === 'signing') {
      console.error('签名失败:', error)
      setSigningStatus('error')
    }
  }, [isError, error, signingStatus])

  const handleSignMessage = () => {
    setSigningStatus('signing')
    signMessage({ message })
  }

  return (
    <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">Sign Message</h3>

      <Input
        placeholder="输入要签名的消息"
        className="bg-gray-900 border-gray-700 text-white"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <Button
        className="w-full py-3 text-base font-semibold bg-gray-800 hover:bg-gray-800/60 mt-3"
        onClick={handleSignMessage}
        disabled={signing}
      >
        {signing ? '签名中...' : '签名消息'}
      </Button>

      {signingStatus === 'success' && (
        <p className="text-green-500 mt-2">✅ 签名成功!</p>
      )}
      {signingStatus === 'error' && (
        <p className="text-red-500 mt-2">❌ 签名失败</p>
      )}

      {signature && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-1">签名结果:</p>
          <p className="text-xs bg-gray-700 p-2 rounded break-all">
            {signature}
          </p>
        </div>
      )}
    </div>
  )
}
