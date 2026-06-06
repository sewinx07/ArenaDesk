'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Lock, User, Phone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/components/layout/AuthLayout';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    venueName: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/login');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your 14-day free trial. No credit card required."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-600/10 border border-red-600/30 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Venue Name"
            value={formData.venueName}
            onChange={(e) => updateField('venueName', e.target.value)}
            icon={<Building2 className="h-4 w-4" />}
            placeholder="My Gaming Cafe"
            required
          />
          <Input
            label="Your Name"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            icon={<User className="h-4 w-4" />}
            placeholder="John Doe"
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@example.com"
          required
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          icon={<Phone className="h-4 w-4" />}
          placeholder="+1 234 567 890"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            placeholder="Min. 8 characters"
            required
            minLength={8}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => updateField('confirmPassword', e.target.value)}
            icon={<Lock className="h-4 w-4" />}
            placeholder="Repeat password"
            required
            minLength={8}
          />
        </div>

        <p className="text-xs text-surface-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">Privacy Policy</a>.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={isLoading}>
          {isLoading ? 'Creating account...' : 'Create Account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
