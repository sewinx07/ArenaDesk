'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { type MembershipTier } from '@/types';
import { Star, Shield, Gem, Trophy, Diamond } from 'lucide-react';

const tierConfig: Record<MembershipTier, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}> = {
  bronze: {
    label: 'Bronze',
    color: 'text-amber-600',
    bg: 'bg-amber-600/10',
    border: 'border-amber-600/30',
    icon: <Star className="h-3.5 w-3.5" />,
  },
  silver: {
    label: 'Silver',
    color: 'text-slate-300',
    bg: 'bg-slate-400/10',
    border: 'border-slate-400/30',
    icon: <Shield className="h-3.5 w-3.5" />,
  },
  gold: {
    label: 'Gold',
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/30',
    icon: <Gem className="h-3.5 w-3.5" />,
  },
  platinum: {
    label: 'Platinum',
    color: 'text-cyan-300',
    bg: 'bg-cyan-400/10',
    border: 'border-cyan-400/30',
    icon: <Trophy className="h-3.5 w-3.5" />,
  },
  diamond: {
    label: 'Diamond',
    color: 'text-blue-300',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    icon: <Diamond className="h-3.5 w-3.5" />,
  },
};

interface LoyaltyBadgeProps {
  tier: MembershipTier;
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

export default function LoyaltyBadge({ tier, showIcon = true, size = 'default' }: LoyaltyBadgeProps) {
  const config = tierConfig[tier];

  return (
    <Badge
      variant="default"
      size={size}
      className={cn(
        config.bg,
        config.border,
        config.color,
        'font-semibold'
      )}
    >
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
