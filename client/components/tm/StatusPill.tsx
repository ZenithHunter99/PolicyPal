import React from 'react'
import { Badge } from '../ui/badge'

interface StatusPillProps {
  status: 'Active' | 'Renewal Due' | 'Lapsed' | 'active' | 'inactive' | 'pending' | 'expired' | 'cancelled'
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const getStatusConfig = (status: StatusPillProps['status']) => {
    switch (status) {
      case 'Active':
      case 'active':
        return { variant: 'default' as const, text: 'Active' }
      case 'Renewal Due':
        return { variant: 'outline' as const, text: 'Renewal Due' }
      case 'Lapsed':
        return { variant: 'destructive' as const, text: 'Lapsed' }
      case 'inactive':
        return { variant: 'secondary' as const, text: 'Inactive' }
      case 'pending':
        return { variant: 'outline' as const, text: 'Pending' }
      case 'expired':
        return { variant: 'destructive' as const, text: 'Expired' }
      case 'cancelled':
        return { variant: 'destructive' as const, text: 'Cancelled' }
      default:
        return { variant: 'secondary' as const, text: 'Unknown' }
    }
  }

  const { variant, text } = getStatusConfig(status)

  return (
    <Badge variant={variant} className={className}>
      {text}
    </Badge>
  )
}
