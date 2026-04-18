import { formatCurrency } from '../lib/calculations';
import type { ScenarioResult } from '../lib/types';

interface Props {
  a: ScenarioResult;
  b: ScenarioResult;
}

export default function ComparisonSummary({ a, b }: Props) {
  const monthlySubsidyDifference = a.estimatedMonthlyAptc - b.estimatedMonthlyAptc;
  const annualSubsidyDifference = a.estimatedAnnualAptc - b.estimatedAnnualAptc;
  const annualPremiumDifference = b.estimatedAnnualNetPremium - a.estimatedAnnualNetPremium;

  return (
    <section className="panel comparison-panel">
      <h2>Comparison summary</h2>
      <div className="metric-grid">
        <div>
          <span>Subsidy difference per month</span>
          <strong>{formatCurrency(monthlySubsidyDifference)}</strong>
        </div>
        <div>
          <span>Subsidy difference per year</span>
          <strong>{formatCurrency(annualSubsidyDifference)}</strong>
        </div>
        <div>
          <span>Annual premium difference</span>
          <strong>{formatCurrency(annualPremiumDifference)}</strong>
        </div>
        <div>
          <span>CSR change</span>
          <strong>{a.csrTier === b.csrTier ? 'No change' : `${a.csrTier} vs ${b.csrTier}`}</strong>
        </div>
      </div>
      <p className="summary-text">
        Scenario A produces {formatCurrency(Math.abs(monthlySubsidyDifference))} {monthlySubsidyDifference >= 0 ? 'more' : 'less'} subsidy per month than Scenario B.
        The CSR comparison is {a.csrTier === b.csrTier ? 'unchanged between the two scenarios.' : 'different, so plan value may shift materially.'}
      </p>
    </section>
  );
}
