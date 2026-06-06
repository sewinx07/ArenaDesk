'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Calendar, Clock, User, Monitor, DollarSign } from 'lucide-react';
import type { ResourceType } from '@/types';

const resourceTypes = [
  { value: 'pc', label: 'PC Station' },
  { value: 'console', label: 'Console' },
  { value: 'vip_room', label: 'VIP Room' },
  { value: 'event_space', label: 'Event Space' },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => ({
  value: `${i.toString().padStart(2, '0')}:00`,
  label: `${i.toString().padStart(2, '0')}:00`,
}));

export default function ReservationForm() {
  const [resourceType, setResourceType] = useState<ResourceType>('pc');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Resource Type"
          options={resourceTypes}
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value as ResourceType)}
          placeholder="Select resource type"
        />

        <Select
          label="Resource"
          options={[
            { value: 'pc01', label: 'PC #01' },
            { value: 'pc02', label: 'PC #02' },
            { value: 'console01', label: 'Console #01' },
            { value: 'vip_a', label: 'VIP Room A' },
          ]}
          placeholder="Select resource"
        />

        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={<Calendar className="h-4 w-4" />}
        />

        <div className="grid grid-cols-2 gap-2">
          <Select
            label="Start Time"
            options={timeSlots}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start"
          />
          <Select
            label="End Time"
            options={timeSlots}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="End"
          />
        </div>
      </div>

      <div className="border-t border-surface-700/30 pt-4">
        <h3 className="text-sm font-medium text-white mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            icon={<User className="h-4 w-4" />}
            placeholder="Enter name"
          />
          <Input
            label="Email"
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="email@example.com"
          />
          <Input
            label="Phone"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+1 234 567 890"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg bg-surface-800/50 p-4">
        <div>
          <p className="text-sm text-surface-400">Estimated Total</p>
          <p className="text-2xl font-bold text-white">$12.00</p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" variant="gradient">
            <DollarSign className="h-4 w-4 mr-2" />
            Create Reservation
          </Button>
        </div>
      </div>
    </form>
  );
}
