export type FilingStatus = 'single' | 'married_joint' | 'head_of_household';

export interface HouseholdInput {
  householdSize: number;
  ages: string;
  stateCode: string;
  zipCode: string;
  county: string;
  monthsCovered: number;
  filingStatus: FilingStatus;
  monthlyBenchmarkPremium: number;
}

export interface ScenarioInput {
  label: string;
  projectedIncome: number;
  expectedActualIncome?: number;
}

export interface ScenarioResult {
  label: string;
  projectedIncome: number;
  expectedActualIncome?: number;
  fplPercentProjected: number;
  fplPercentActual?: number;
  csrTier: string;
  allowedMonthlyPremiumContribution: number;
  estimatedMonthlyAptc: number;
  estimatedAnnualAptc: number;
  estimatedMonthlyNetPremium: number;
  estimatedAnnualNetPremium: number;
  estimatedCorrectAnnualAptcAtActual?: number;
  estimatedExcessAptc?: number;
  estimatedRepaymentExposure?: number;
}
