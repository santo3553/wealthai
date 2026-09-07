import { CalculatorInputs, CalculationResults, YearProjection } from '../types/calculator';
import { SOFTWARE_TIERS } from './presets';

export function calculateROI(inputs: CalculatorInputs): CalculationResults {
  const { teamSize, weeklyHours, hourlyRate, efficiencyGain, tier } = inputs;

  // Selected Tier
  const tierConfig = SOFTWARE_TIERS[tier] || SOFTWARE_TIERS.pro;
  const monthlyPlatformCost = tierConfig.monthlyCost;
  const annualPlatformCost = monthlyPlatformCost * 12;

  // Calculations
  const annualManualHours = teamSize * (weeklyHours * 52);
  const annualManualCost = annualManualHours * hourlyRate;

  const annualHoursSaved = annualManualHours * (efficiencyGain / 100);
  const annualGrossSavings = annualHoursSaved * hourlyRate;

  const netAnnualSavings = annualGrossSavings - annualPlatformCost;

  // ROI Multiple = (Annual Gross Savings / Annual Platform Cost).toFixed(1) + "x"
  let roiMultiple = 0;
  let roiMultipleFormatted = '0.0x';
  if (annualPlatformCost > 0) {
    roiMultiple = annualGrossSavings / annualPlatformCost;
    roiMultipleFormatted = `${roiMultiple.toFixed(1)}x`;
  }

  // Payback Period (Months) = (Annual Platform Cost / (Annual Gross Savings / 12)).toFixed(1) + " Months"
  const monthlyGrossSavings = annualGrossSavings / 12;
  let paybackMonths = 0;
  let paybackPeriodFormatted = '< 0.1 Months';

  if (monthlyGrossSavings <= 0) {
    paybackMonths = 0;
    paybackPeriodFormatted = 'N/A';
  } else {
    paybackMonths = annualPlatformCost / monthlyGrossSavings;
    if (paybackMonths < 0.1) {
      paybackPeriodFormatted = '< 0.1 Months';
    } else if (paybackMonths > 60) {
      paybackPeriodFormatted = '> 5 Years';
    } else {
      paybackPeriodFormatted = `${paybackMonths.toFixed(1)} Months`;
    }
  }

  // 3-Year Projections (Cumulative and Annual)
  const annualAutomatedLaborCost = annualManualCost - annualGrossSavings;
  const annualTotalAutomationCost = annualAutomatedLaborCost + annualPlatformCost;
  const totalMonthlyAutomatedCost = annualTotalAutomationCost / 12;
  const totalMonthlyManualCost = annualManualCost / 12;

  const projections: YearProjection[] = [1, 2, 3].map((yr) => {
    const statusQuoCost = annualManualCost * yr;
    const costWithAutomation = annualTotalAutomationCost * yr;
    const cumulativeSavings = statusQuoCost - costWithAutomation; // equals netAnnualSavings * yr

    return {
      year: `Year ${yr}`,
      yearNum: yr,
      statusQuoCost: Math.round(statusQuoCost),
      costWithAutomation: Math.round(costWithAutomation),
      cumulativeSavings: Math.round(cumulativeSavings),
      annualManualCost: Math.round(annualManualCost),
      annualAutomationCost: Math.round(annualTotalAutomationCost),
      annualGrossSavings: Math.round(annualGrossSavings),
      annualNetSavings: Math.round(netAnnualSavings),
    };
  });

  const hoursSavedPerEmployeePerWeek = weeklyHours * (efficiencyGain / 100);

  return {
    annualManualCost,
    annualHoursSaved,
    annualGrossSavings,
    annualPlatformCost,
    netAnnualSavings,
    roiMultiple,
    roiMultipleFormatted,
    paybackMonths,
    paybackPeriodFormatted,
    projections,
    hoursSavedPerEmployeePerWeek,
    totalMonthlyManualCost,
    totalMonthlyAutomatedCost,
  };
}
