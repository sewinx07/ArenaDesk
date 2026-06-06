'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ReservationForm from '@/components/reservations/ReservationForm';
import { toast } from '@/components/ui/toast';

export default function NewReservationPage() {
  const router = useRouter();

  const handleSubmit = () => {
    toast.success('Reservation created successfully!');
    router.push('/reservations');
  };

  return (
    <div className="space-y-6 animate-in max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/reservations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Reservation</h1>
          <p className="text-sm text-surface-400 mt-1">
            Book a PC, console, or VIP room for a customer.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reservation Details</CardTitle>
          <CardDescription>Fill in the details to create a new reservation.</CardDescription>
        </CardHeader>
        <CardContent>
          <ReservationForm />
        </CardContent>
      </Card>
    </div>
  );
}
