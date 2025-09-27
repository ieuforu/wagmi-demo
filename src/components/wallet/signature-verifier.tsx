'use client'

import { useState, useEffect } from 'react'
import { useVerifyMessage } from 'wagmi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface SignatureVerifierProps {
  message: string
  signature: string
}

export function SignatureVerifier({
  message,
  signature,
}: SignatureVerifierProps) {
  const [addressToVerify, setAddressToVerify] = useState('')
  const [shouldVerify, setShouldVerify] = useState(false)

  const {
    data: isValid,
    isLoading: verifying,
    isError: verifyError,
    error: verifyErrorMessage,
  } = useVerifyMessage({
    address:
      shouldVerify && addressToVerify
        ? (addressToVerify as `0x${string}`)
        : undefined,
    message: shouldVerify && signature ? message : '',
    signature:
      shouldVerify && signature ? (signature as `0x${string}`) : undefined,
    enabled: shouldVerify && !!addressToVerify && !!signature && !!message,
  })

  useEffect(() => {
    if (isValid !== undefined && shouldVerify) {
      if (isValid) {
        toast.success('✅ 签名有效！')
      } else {
        toast.error('❌ 签名无效！')
      }
      setShouldVerify(false) // 重置验证状态
    }
  }, [isValid, shouldVerify])

  const handleVerifyMessage = () => {
    if (!signature || !addressToVerify || !message) {
      toast('请填写所有字段')
      return
    }
    setShouldVerify(true)
  }

  return (
    <div className="p-4 rounded-xl bg-gray-800 border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-1">
        Verify Signature
      </h3>
      <Input
        placeholder="输入地址进行验证"
        className="bg-gray-900 border-gray-700 text-white"
        value={addressToVerify}
        onChange={e => setAddressToVerify(e.target.value)}
      />
      <Button
        className="w-full py-3 text-base font-semibold bg-gray-800 hover:bg-gray-800/60 mt-3"
        onClick={handleVerifyMessage}
        disabled={verifying || !signature || !addressToVerify || !message}
      >
        {verifying ? '验证中...' : '验证签名'}
      </Button>
    </div>
  )
}
