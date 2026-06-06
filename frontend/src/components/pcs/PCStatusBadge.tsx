'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { type PCStatus } from '@/types';

const statusConfig: Record<PCStatus, { variant: 'success' | 'warning' | 'danger' | 'default'; label: string }> = {
  available: { variant: 'success', label: 'Available' },
  in_use: { variant: 'warning', label: 'In Use' },
  maintenance: { variant: 'danger', label: 'Maintenance' },
  offline: { variant: 'default', label: 'Offline' },
};

interface PCStatusBadgeProps {
  status: PCStatus;
  size?: 'sm' | 'default' | 'lg';
}

export default function PCStatusBadge({ status, size = 'default' }: PCStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} size={size}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </Badge>
  );
}
