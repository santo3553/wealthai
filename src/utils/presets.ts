import { Preset, Tier, CalculatorInputs } from '../types/calculator';

export const SOFTWARE_TIERS: Record<string, Tier> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyCost: 199,
    annualCost: 199 * 12,
    description: 'For boutique agencies and nimble teams automating essential workflows.',
    features: ['Up to 15 team members', 'Core workflow automation', 'Standard analytics', 'Email support'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlyCost: 499,
    annualCost: 499 * 12,
    description: 'For high-velocity scaling companies looking to maximize cross-team output.',
    features: ['Up to 75 team members', 'Advanced pipeline orchestration', 'Real-time ROI dashboard', 'Priority 24/7 support'],
    recommended: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyCost: 999,
    annualCost: 999 * 12,
    description: 'For large operations requiring custom governance, SOC2 compliance, & dedicated TAM.',
    features: ['Unlimited team members', 'Custom AI agent integrations', 'Dedicated Technical Account Manager', 'Custom SLAs & SSO/SAML'],
  },
};

export const INDUSTRY_PRESETS: Preset[] = [
  {
    id: 'small_agency',
    name: 'Small Agency',
    subtitle: 'Boutique & Marketing Teams',
    badge: '10 FTEs',
    teamSize: 10,
    weeklyHours: 6,
    hourlyRate: 35,
    efficiencyGain: 35,
    tier: 'starter',
  },
  {
    id: 'growth_stage',
    name: 'Growth Stage',
    subtitle: 'Scale-ups & SaaS Teams',
    badge: '35 FTEs',
    teamSize: 35,
    weeklyHours: 8,
    hourlyRate: 50,
    efficiencyGain: 40,
    tier: 'pro',
  },
  {
    id: 'enterprise_ops',
    name: 'Enterprise Ops',
    subtitle: 'Global Operations & Support',
    badge: '120 FTEs',
    teamSize: 120,
    weeklyHours: 12,
    hourlyRate: 70,
    efficiencyGain: 50,
    tier: 'enterprise',
  },
];

export const DEFAULT_INPUTS: CalculatorInputs = {
  teamSize: 28,
  weeklyHours: 8,
  hourlyRate: 48,
  efficiencyGain: 42,
  tier: 'pro',
};
