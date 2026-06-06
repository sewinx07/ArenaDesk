'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { User, Mail, Phone, Calendar, Tag } from 'lucide-react';
import type { MembershipTier } from '@/types';

const tierOptions = [
  { value: 'bronze', label: 'Bronze' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' },
  { value: 'diamond', label: 'Diamond' },
];

interface MemberFormProps {
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    membershipTier?: MembershipTier;
    notes?: string;
  };
  onSubmit?: (data: any) => void;
}

export default function MemberForm({ initialData, onSubmit }: MemberFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [tier, setTier] = useState<MembershipTier>(initialData?.membershipTier || 'bronze');
  const [notes, setNotes] = useState(initialData?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ name, email, phone, tier, notes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User className="h-4 w-4" />}
          placeholder="John Doe"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          placeholder="john@example.com"
          required
        />
        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          placeholder="+1 234 567 890"
          required
        />
        <Select
          label="Membership Tier"
          options={tierOptions}
          value={tier}
          onChange={(e) => setTier(e.target.value as MembershipTier)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">Notes</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-lg border border-surface-700 bg-surface-800/50 px-3 py-2 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit" variant="gradient">
          {initialData ? 'Update Member' : 'Create Member'}
        </Button>
      </div>
    </form>
  );
}
