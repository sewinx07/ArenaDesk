'use client';

import React, { useState } from 'react';
import { Save, CreditCard, Bell, Shield, Globe, Building2, DollarSign, User, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';

const plans = [
  { id: 'starter', name: 'Starter', price: 15, features: ['Up to 20 PCs', 'Basic session management', 'Simple billing', '1 cafe', 'Email support'] },
  { id: 'pro', name: 'Pro', price: 35, features: ['Up to 50 PCs', 'Advanced session & billing', 'Reservation system', 'Loyalty programs', 'POS integration', '5 cafes', 'Priority support'] },
  { id: 'enterprise', name: 'Enterprise', price: 99, features: ['Unlimited PCs', 'Full feature access', 'Tournament management', 'AI analytics', 'API access', 'Unlimited cafes', 'Custom integrations', '24/7 dedicated support'] },
];

export default function SettingsPage() {
  const [activePlan, setActivePlan] = useState('pro');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-surface-400 mt-1">
          Manage your account, billing, and venue preferences.
        </p>
      </div>

      <Tabs value="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary-400" />
                  <CardTitle>Venue Information</CardTitle>
                </div>
                <CardDescription>Update your gaming venue details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Venue Name" defaultValue="Main Cafe Downtown" />
                  <Input label="Email" type="email" defaultValue="main@ArenaDesk.io" />
                  <Input label="Phone" defaultValue="+1 212 555 0101" />
                  <Input label="Timezone" defaultValue="America/New_York" />
                </div>
                <Input label="Address" defaultValue="123 Gaming Street, New York, USA" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Opening Time" type="time" defaultValue="08:00" />
                  <Input label="Closing Time" type="time" defaultValue="02:00" />
                </div>
                <Button onClick={handleSave} loading={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                  <CardTitle>Current Plan</CardTitle>
                </div>
                <CardDescription>You are currently on the <strong className="text-white">Pro</strong> plan.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl border p-5 cursor-pointer transition-all ${
                        activePlan === plan.id
                          ? 'border-primary-600/50 bg-primary-600/5 shadow-lg shadow-primary-600/10'
                          : 'border-surface-700/50 bg-surface-800/30 hover:border-surface-600/50'
                      }`}
                      onClick={() => setActivePlan(plan.id)}
                    >
                      {plan.id === 'pro' && (
                        <div className="absolute -top-2 right-2">
                          <Badge variant="primary" size="sm">Current</Badge>
                        </div>
                      )}
                      <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-bold text-white">${plan.price}</span>
                        <span className="text-xs text-surface-500">/month</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-xs text-surface-400">
                            <Check className="h-3 w-3 text-emerald-400 mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={activePlan === plan.id ? 'gradient' : 'outline'}
                        size="sm"
                        className="w-full"
                        onClick={(e) => { e.stopPropagation(); setActivePlan(plan.id); }}
                      >
                        {activePlan === plan.id ? 'Current Plan' : `Switch to ${plan.name}`}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-cyan-400" />
                  <CardTitle>Payment Methods</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-surface-700/30 bg-surface-800/30 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-800">
                      <CreditCard className="h-5 w-5 text-surface-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                      <p className="text-xs text-surface-500">Expires 12/2027</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Default</Badge>
                </div>
                <Button variant="outline" className="mt-3">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>Choose which notifications you want to receive.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Session started/ended', desc: 'When a PC session starts or ends' },
                  { label: 'New reservations', desc: 'When a customer makes a reservation' },
                  { label: 'Payment received', desc: 'When a payment is successfully processed' },
                  { label: 'Low stock alerts', desc: 'When product inventory is running low' },
                  { label: 'Daily summary', desc: 'End-of-day revenue and activity summary' },
                  { label: 'Tournament updates', desc: 'When tournament brackets are updated' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-surface-800/30 p-3">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-surface-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" defaultChecked className="peer sr-only" />
                      <div className="h-5 w-9 rounded-full bg-surface-700 after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-4" />
                    </label>
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} className="mt-4" loading={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-400" />
                  <CardTitle>Security Settings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Current Password" type="password" placeholder="Enter current password" />
                  <Input label="New Password" type="password" placeholder="Enter new password" />
                </div>
                <Input label="Confirm New Password" type="password" placeholder="Confirm new password" />
                <Button variant="destructive">Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg bg-surface-800/30 p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Two-factor authentication</p>
                      <p className="text-xs text-surface-500">Secure your account with 2FA</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>Manage your active sessions across devices.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-surface-800/30 p-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-emerald-400" />
                      <div>
                        <p className="text-sm text-white">Chrome on Windows</p>
                        <p className="text-xs text-surface-500">Active now - New York, USA</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-surface-800/30 p-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-surface-500" />
                      <div>
                        <p className="text-sm text-white">Safari on iPhone</p>
                        <p className="text-xs text-surface-500">2 hours ago - New York, USA</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-red-400">Revoke</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
