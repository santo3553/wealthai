export type TierId = 'starter' | 'pro' | 'enterprise';

export interface Tier {
  id: TierId;
  name: string;
  monthlyCost: number;
  annualCost: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export type PresetId = 'small_agency' | 'growth_stage' | 'enterprise_ops';

export interface Preset {
  id: PresetId;
  name: string;
  subtitle: string;
  badge: string;
  teamSize: number;
  weeklyHours: number;
  hourlyRate: number;
  efficiencyGain: number;
  tier: TierId;
}

export interface CalculatorInputs {
  teamSize: number;
  weeklyHours: number;
  hourlyRate: number;
  efficiencyGain: number;
  tier: TierId;
}

export interface YearProjection {
  year: string;
  yearNum: number;
  statusQuoCost: number;
  costWithAutomation: number;
  cumulativeSavings: number;
  annualManualCost: number;
  annualAutomationCost: number;
  annualGrossSavings: number;
  annualNetSavings: number;
}

export interface CalculationResults {
  annualManualCost: number;
  annualHoursSaved: number;
  annualGrossSavings: number;
  annualPlatformCost: number;
  netAnnualSavings: number;
  roiMultiple: number;
  roiMultipleFormatted: string;
  paybackMonths: number;
  paybackPeriodFormatted: string;
  projections: YearProjection[];
  hoursSavedPerEmployeePerWeek: number;
  totalMonthlyManualCost: number;
  totalMonthlyAutomatedCost: number;
}
