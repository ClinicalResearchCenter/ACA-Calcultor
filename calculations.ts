import {
  ADDITIONAL_PERSON_FPL,
  APPLICABLE_PERCENTAGE_2026,
  CONTIGUOUS_STATES,
  FPL_2025_48_DC,
  FPL_2025_ALASKA,
  FPL_2025_HAWAII,
} from './constants';
import type { HouseholdInput, ScenarioInput, ScenarioResult } from './types';

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getFpl(householdSize: number, stateCode: string): number {
  const normalized = stateCode.trim().toUpperCase();
  const region = normalized === 'AK' ? 'alaska' : normalized === 'HI' ? 'hawaii' : 'contiguous';
  const table = region === 'alaska' ? FPL_2025_ALASKA : region === 'hawaii' ? FPL_2025_HAWAII : FPL_2025_48_DC;

  if (table[householdSize]) {
    return table[householdSize];
  }

  const base = table[8];
  const additionalPeople = householdSize - 8;
  const increment = region === 'alaska' ? ADDITIONAL_PERSON_FPL.alaska : region === 'hawaii' ? ADDITIONAL_PERSON_FPL.hawaii : ADDITIONAL_PERSON_FPL.contiguous;
  return base + additionalPeople * increment;
}

export function getFplPercent(income: number, fpl: number): number {
  return (income / fpl) * 100;
}

export function getApplicablePercentage(fplPercent: number): number | null {
  const decimal = fplPercent / 100;
  if (decimal > 4) {
    return null;
  }

  for (const row of APPLICABLE_PERCENTAGE_2026) {
    if (decimal >= row.min && decimal <= row.max) {
      const span = row.max - row.min;
      if (span === 0) {
        return row.final;
      }
      const progress = (decimal - row.min) / span;
      return row.initial + progress * (row.final - row.initial);
    }
  }

  return null;
}

export function getCsrTier(fplPercent: number): string {
  if (fplPercent <= 150) return '100% to 150% FPL · strongest CSR';
  if (fplPercent <= 200) return '150% to 200% FPL · strong CSR';
  if (fplPercent <= 250) return '200% to 250% FPL · moderate CSR';
  return 'Over 250% FPL · no CSR';
}

export function calculateScenario(household: HouseholdInput, scenario: ScenarioInput): ScenarioResult {
  const fpl = getFpl(household.householdSize, household.stateCode);
  const projectedFplPercent = getFplPercent(scenario.projectedIncome, fpl);
  const applicablePercentage = getApplicablePercentage(projectedFplPercent);
  const annualContribution = applicablePercentage === null ? household.monthlyBenchmarkPremium * household.monthsCovered : scenario.projectedIncome * applicablePercentage;
  const annualBenchmark = household.monthlyBenchmarkPremium * household.monthsCovered;
  const annualAptc = Math.max(0, annualBenchmark - annualContribution);
  const monthlyAptc = annualAptc / household.monthsCovered;
  const annualNetPremium = Math.max(0, annualBenchmark - annualAptc);
  const monthlyNetPremium = annualNetPremium / household.monthsCovered;

  let actualFplPercent: number | undefined;
  let correctAnnualAptcAtActual: number | undefined;
  let excessAptc: number | undefined;
  let repaymentExposure: number | undefined;

  if (scenario.expectedActualIncome !== undefined && scenario.expectedActualIncome > 0) {
    actualFplPercent = getFplPercent(scenario.expectedActualIncome, fpl);
    const actualApplicablePercentage = getApplicablePercentage(actualFplPercent);
    const actualAnnualContribution = actualApplicablePercentage === null ? annualBenchmark : scenario.expectedActualIncome * actualApplicablePercentage;
    correctAnnualAptcAtActual = Math.max(0, annualBenchmark - actualAnnualContribution);
    excessAptc = Math.max(0, annualAptc - correctAnnualAptcAtActual);
    repaymentExposure = excessAptc;
  }

  return {
    label: scenario.label,
    projectedIncome: scenario.projectedIncome,
    expectedActualIncome: scenario.expectedActualIncome,
    fplPercentProjected: projectedFplPercent,
    fplPercentActual: actualFplPercent,
    csrTier: getCsrTier(projectedFplPercent),
    allowedMonthlyPremiumContribution: roundCurrency(annualContribution / household.monthsCovered),
    estimatedMonthlyAptc: roundCurrency(monthlyAptc),
    estimatedAnnualAptc: roundCurrency(annualAptc),
    estimatedMonthlyNetPremium: roundCurrency(monthlyNetPremium),
    estimatedAnnualNetPremium: roundCurrency(annualNetPremium),
    estimatedCorrectAnnualAptcAtActual: correctAnnualAptcAtActual === undefined ? undefined : roundCurrency(correctAnnualAptcAtActual),
    estimatedExcessAptc: excessAptc === undefined ? undefined : roundCurrency(excessAptc),
    estimatedRepaymentExposure: repaymentExposure === undefined ? undefined : roundCurrency(repaymentExposure),
  };
}

export function getStateRegionLabel(stateCode: string): string {
  const normalized = stateCode.trim().toUpperCase();
  if (normalized === 'AK') return 'Alaska';
  if (normalized === 'HI') return 'Hawaii';
  return CONTIGUOUS_STATES.has(normalized) ? '48 states and DC' : '48 states and DC';
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
