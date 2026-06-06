'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Monitor,
  CalendarCheck,
  Users,
  Swords,
  ShoppingCart,
  BarChart3,
  Building2,
  Shield,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  Zap,
  Clock,
  Lock,
  DollarSign,
  Trophy,
  CreditCard,
  LineChart,
  Target,
  Layers,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Monitor,
    title: 'Session Tracking',
    description: 'Real-time PC timer with auto billing. Track usage, lock/unlock remotely, and monitor all workstations live.',
    gradient: 'from-primary-600 to-cyan-600',
  },
  {
    icon: DollarSign,
    title: 'Smart Billing',
    description: 'Auto-calculate payments based on time used. Support hourly rates, packages, and membership discounts.',
    gradient: 'from-cyan-600 to-teal-600',
  },
  {
    icon: Lock,
    title: 'PC Control',
    description: 'Lock/unlock PCs remotely from the dashboard. End sessions, manage access, and enforce time limits.',
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    icon: CalendarCheck,
    title: 'Reservations',
    description: 'Book PCs, consoles, and VIP rooms in advance. Time-slot management with automated confirmations.',
    gradient: 'from-amber-600 to-red-600',
  },
  {
    icon: Users,
    title: 'Customer Loyalty',
    description: 'Points-based loyalty system with membership tiers. Discounts, rewards, and detailed customer profiles.',
    gradient: 'from-emerald-600 to-teal-600',
  },
  {
    icon: Swords,
    title: 'Tournaments',
    description: 'Create brackets, manage registrations, track matches, and auto-distribute prize pools.',
    gradient: 'from-primary-600 to-purple-600',
  },
  {
    icon: LineChart,
    title: 'AI Analytics',
    description: 'Predict peak hours, forecast revenue, analyze customer behavior, and get actionable insights.',
    gradient: 'from-cyan-600 to-blue-600',
  },
  {
    icon: Building2,
    title: 'Multi-Cafe',
    description: 'Manage multiple cafe locations from one dashboard. Centralized reporting, staff, and inventory management.',
    gradient: 'from-slate-600 to-surface-600',
  },
];

const problemSolutions = [
  { problem: 'Manual time tracking', solution: 'Automated session management with real-time billing' },
  { problem: 'Revenue leakage', solution: 'Lock/unlock PCs, prepaid sessions, automated invoicing' },
  { problem: 'Reservation conflicts', solution: 'Smart calendar with online booking and payments' },
  { problem: 'Poor customer management', solution: 'Membership tiers, loyalty points, and detailed profiles' },
  { problem: 'No analytics', solution: 'AI-powered insights, forecasting, and exportable reports' },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: 15,
    description: 'Perfect for small gaming cafés getting started',
    features: ['Up to 20 PCs', 'Basic session management', 'Simple billing', '1 cafe', 'Email support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 35,
    description: 'Ideal for growing esports venues',
    features: ['Up to 50 PCs', 'Advanced session & billing', 'Reservation system', 'Loyalty programs', 'POS integration', '5 cafes', 'Priority support'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large gaming arenas & multi-location chains',
    features: ['Unlimited PCs', 'Full feature access', 'Tournament management', 'AI analytics', 'API access', 'Unlimited cafes', 'Custom integrations', '24/7 dedicated support'],
    cta: 'Contact Sales',
    popular: false,
  },
];

const roadmap = [
  { phase: 'Phase 1', title: 'MVP Launch', items: ['Core session management', 'PC monitoring', 'Basic billing', 'Staff management'], status: 'completed' as const, date: 'Q1 2026' },
  { phase: 'Phase 2', title: 'Reservations & POS', items: ['Smart reservation system', 'POS integration', 'Customer portal', 'Payment processing'], status: 'in_progress' as const, date: 'Q2 2026' },
  { phase: 'Phase 3', title: 'Mobile & Ecosystem', items: ['Mobile app launch', 'Desktop client', 'Real-time sync', 'Push notifications'], status: 'upcoming' as const, date: 'Q3 2026' },
  { phase: 'Phase 4', title: 'AI & Tournaments', items: ['AI analytics engine', 'Tournament platform', 'Advanced reporting', 'Ecosystem APIs'], status: 'upcoming' as const, date: 'Q4 2026' },
];

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const duration = 2000;
    const start = performance.now();
    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-950">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-cyan-600 shadow-lg shadow-primary-600/20">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                ArenaDesk <span className="text-cyan-400">OS</span>
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {['Features', 'Pricing', 'Roadmap'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-surface-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient">Get Started</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-surface-400 hover:text-white hover:bg-surface-800"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-surface-800/50 bg-surface-950">
            <div className="px-4 py-4 space-y-3">
              {['Features', 'Pricing', 'Roadmap'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-surface-400 hover:text-white py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="flex gap-3 pt-3 border-t border-surface-800/50">
                <Link href="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button variant="gradient" className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/30 via-surface-950 to-surface-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-600/30 bg-primary-600/10 px-4 py-1.5 mb-8">
            <Zap className="h-4 w-4 text-primary-400" />
            <span className="text-sm text-primary-300">The Operating System for Gaming Venues</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-6">
            ArenaDesk{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-cyan-400 to-primary-400 gradient-shift">
              OS
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-surface-300 max-w-3xl mx-auto mb-4 font-medium">
            The Operating System for Gaming Cafés & Esports Venues
          </p>
          <p className="text-base sm:text-lg text-surface-500 max-w-2xl mx-auto mb-10">
            Digitize your gaming café through a unified SaaS ecosystem.
            Manage sessions, reservations, tournaments, staff, and analytics from a single dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" variant="gradient" className="text-base px-10 neon-glow-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="xl" variant="outline" className="text-base px-10">
                Explore Features
              </Button>
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-surface-500">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              14-day free trial
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-400" />
              Cancel anytime
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1"><AnimatedCounter target={500} suffix="+" /></div>
              <p className="text-sm text-surface-400">Venues</p>
            </div>
            <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1"><AnimatedCounter target={12000} suffix="+" /></div>
              <p className="text-sm text-surface-400">PCs Managed</p>
            </div>
            <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1"><AnimatedCounter target={500000} suffix="+" /></div>
              <p className="text-sm text-surface-400">Sessions Tracked</p>
            </div>
            <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-1"><AnimatedCounter target={99} suffix="%" /></div>
              <p className="text-sm text-surface-400">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to run your gaming venue
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              From session management to AI analytics, ArenaDesk OS provides a complete toolkit
              for gaming cafés and esports venues of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 hover:border-surface-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
              >
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br mb-4 shadow-lg',
                  feature.gradient
                )}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                The problem we solve
              </h2>
              <div className="space-y-3">
                {problemSolutions.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 rounded-lg bg-surface-900/30 border border-surface-700/30 p-4 hover:border-surface-600/30 transition-all">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600/20">
                      <ArrowRight className="h-4 w-4 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-400">{item.problem}</p>
                      <p className="text-sm text-emerald-400 mt-1">{item.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center hover:border-primary-500/30 transition-all">
                <div className="text-4xl font-bold gradient-text mb-2">10x</div>
                <p className="text-sm text-surface-400">Faster operations</p>
              </div>
              <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center hover:border-cyan-500/30 transition-all">
                <div className="text-4xl font-bold gradient-text mb-2">99%</div>
                <p className="text-sm text-surface-400">Revenue accuracy</p>
              </div>
              <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center hover:border-primary-500/30 transition-all">
                <div className="text-4xl font-bold gradient-text mb-2">85%</div>
                <p className="text-sm text-surface-400">Higher utilization</p>
              </div>
              <div className="rounded-xl border border-surface-700/50 bg-surface-900/30 p-6 text-center hover:border-cyan-500/30 transition-all">
                <div className="text-4xl font-bold gradient-text mb-2">3x</div>
                <p className="text-sm text-surface-400">Customer retention</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 lg:py-28 bg-surface-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              Choose the plan that fits your venue. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'relative rounded-xl border p-6 transition-all duration-300',
                  plan.popular
                    ? 'border-primary-600/50 bg-primary-600/5 shadow-xl shadow-primary-600/10 neon-glow-primary'
                    : 'border-surface-700/50 bg-surface-900/50 hover:border-surface-600/50 hover:shadow-xl hover:shadow-black/20'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 px-4 py-1 text-xs font-medium text-white shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-surface-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-surface-500">/month</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-surface-300">
                      <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? 'gradient' : 'outline'}
                  className="w-full"
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="py-20 lg:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Our Roadmap</h2>
            <p className="text-lg text-surface-400 max-w-2xl mx-auto">
              We are building the future of gaming venue management. Here is what is coming next.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-600/50 via-cyan-600/50 to-surface-700/30 hidden md:block" />

            <div className="space-y-12">
              {roadmap.map((phase, i) => (
                <div
                  key={phase.phase}
                  className={cn(
                    'relative flex flex-col md:flex-row items-start gap-6',
                    i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  )}
                >
                  <div className="hidden md:flex flex-1 justify-end">
                    {i % 2 === 0 && (
                      <div className="w-full max-w-md">
                        <PhaseCard phase={phase} />
                      </div>
                    )}
                  </div>

                  <div className="hidden md:flex items-center justify-center">
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 z-10',
                      phase.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' :
                      phase.status === 'in_progress' ? 'border-primary-500 bg-primary-500/20 animate-pulse' :
                      'border-surface-600 bg-surface-800'
                    )}>
                      {phase.status === 'completed' ? (
                        <Check className="h-5 w-5 text-emerald-400" />
                      ) : (
                        <div className={cn(
                          'h-3 w-3 rounded-full',
                          phase.status === 'in_progress' ? 'bg-primary-500' : 'bg-surface-600'
                        )} />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 md:hidden">
                    <PhaseCard phase={phase} />
                  </div>
                  {i % 2 !== 0 && (
                    <div className="hidden md:flex flex-1">
                      <div className="w-full max-w-md">
                        <PhaseCard phase={phase} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-cyan-600/10" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to transform your gaming venue?
          </h2>
          <p className="text-lg text-surface-400 mb-8 max-w-2xl mx-auto">
            Join thousands of gaming cafés and esports venues worldwide using ArenaDesk OS.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" variant="gradient" className="text-base px-10 neon-glow-primary">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="xl" variant="outline" className="text-base px-10">
                Schedule a Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-800/50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-cyan-600">
                  <Gamepad2 className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold text-white">ArenaDesk OS</span>
              </div>
              <p className="text-xs text-surface-500 max-w-xs">
                The operating system for gaming cafés and esports venues worldwide. Manage, monitor, and grow your gaming business.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Roadmap', 'Changelog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Resources</h4>
              <ul className="space-y-2">
                {['Documentation', 'API Reference', 'Support', 'Status'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-white mb-3">Company</h4>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-surface-600">
              &copy; {new Date().getFullYear()} ArenaDesk OS. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-surface-600 hover:text-surface-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-surface-600 hover:text-surface-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PhaseCard({ phase }: { phase: { phase: string; title: string; items: string[]; status: string; date: string } }) {
  const statusColors: Record<string, string> = {
    completed: 'text-emerald-400 border-emerald-600/30 bg-emerald-600/10',
    in_progress: 'text-cyan-400 border-cyan-600/30 bg-cyan-600/10',
    upcoming: 'text-surface-400 border-surface-700/30 bg-surface-800/30',
  };

  return (
    <div className={cn('rounded-xl border p-5', statusColors[phase.status])}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary-400">{phase.phase}</span>
        <span className="text-xs text-surface-500">{phase.date}</span>
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{phase.title}</h3>
      <ul className="space-y-1">
        {phase.items.map((item) => (
          <li key={item} className="text-sm text-surface-400 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-surface-600" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
