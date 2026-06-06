'use client';

import React, { useState } from 'react';
import { Plus, Search, Monitor, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PCGrid from '@/components/pcs/PCGrid';
import type { PC, PCStatus } from '@/types';

const samplePCs: PC[] = Array.from({ length: 20 }, (_, i) => ({
  id: `pc-${i + 1}`,
  cafeId: 'cafe-1',
  name: `PC #${String(i + 1).padStart(2, '0')}`,
  identifier: `DESKTOP-${String(i + 1).padStart(3, '0')}`,
  status: (i < 8 ? 'in_use' : i < 14 ? 'available' : i < 17 ? 'maintenance' : 'offline') as PCStatus,
  specs: {
    cpu: i % 2 === 0 ? 'Intel Core i7-13700K' : 'AMD Ryzen 7 7800X3D',
    gpu: i % 2 === 0 ? 'NVIDIA RTX 4070' : 'NVIDIA RTX 4080',
    ram: i % 3 === 0 ? '32GB DDR5' : '16GB DDR5',
    storage: '1TB NVMe SSD',
    os: 'Windows 11 Pro',
  },
  hourlyRate: i % 2 === 0 ? 4.50 : 5.00,
  isLocked: i >= 17,
  totalHoursUsed: 120 + i * 15,
  totalRevenue: 540 + i * 67.5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const tabFilters = [
  { id: 'all', label: 'All PCs', count: samplePCs.length },
  { id: 'available', label: 'Available', count: samplePCs.filter((p) => p.status === 'available').length },
  { id: 'in_use', label: 'In Use', count: samplePCs.filter((p) => p.status === 'in_use').length },
  { id: 'maintenance', label: 'Maintenance', count: samplePCs.filter((p) => p.status === 'maintenance').length },
  { id: 'offline', label: 'Offline', count: samplePCs.filter((p) => p.status === 'offline').length },
];

export default function PCsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPCs = samplePCs.filter(
    (pc) =>
      pc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pc.identifier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">PC Management</h1>
          <p className="text-sm text-surface-400 mt-1">
            Monitor and manage all your gaming workstations in real-time.
          </p>
        </div>
        <Button variant="gradient">
          <Plus className="h-4 w-4 mr-2" />
          Add PC
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search by PC name or identifier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-surface-700/50 bg-surface-800/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Sort
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {tabFilters.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
              <Badge variant="default" size="sm" className="ml-2">{tab.count}</Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabFilters.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <PCGrid pcs={filteredPCs} filter={tab.id as PCStatus | 'all'} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
