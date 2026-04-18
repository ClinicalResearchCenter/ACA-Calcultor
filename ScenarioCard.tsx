import { formatCurrency, formatPercent } from '../lib/calculations';
import type { ScenarioResult } from '../lib/types';

interface Props {
  result: ScenarioResult;
}

export default function ScenarioCard({ result }: Props) {
  return (
    <article className="panel scenario-result">
      <div className="scenario-result-header">
        <h3>{result.label}</h3>
        <span className={`pill ${result.csrTier.includes('no CSR') ? 'pill-neutral' : 'pill-success'}`}>{result.csrTier}</span>
      </div>
      <div className="metric-grid">
        <div>
          <span>Projected income</span>
          <strong>{formatCurrency(result.projectedIncome)}</strong>
        </div>
        <div>
          <span>Projected FPL</span>
          <strong>{formatPercent(result.fplPercentProjected)}</strong>
        </div>
        <div>
          <span>Monthly APTC</span>
          <strong>{formatCurrency(result.estimatedMonthlyAptc)}</strong>
        </div>
        <div>
          <span>Annual APTC</span>
          <strong>{formatCurrency(result.estimatedAnnualAptc)}</strong>
        </div>
        <div>
          <span>Monthly net premium</span>
          <strong>{formatCurrency(result.estimatedMonthlyNetPremium)}</strong>
        </div>
        <div>
          <span>Annual net premium</span>
          <strong>{formatCurrency(result.estimatedAnnualNetPremium)}</strong>
        </div>
      </div>
      {result.expectedActualIncome !== undefined && (
        <div className="repayment-box">
          <h4>Repayment view</h4>
          <div className="metric-grid">
            <div>
              <span>Expected actual income</span>
              <strong>{formatCurrency(result.expectedActualIncome)}</strong>
            </div>
            <div>
              <span>Actual FPL</span>
              <strong>{result.fplPercentActual ? formatPercent(result.fplPercentActual) : '—'}</strong>
            </div>
            <div>
              <span>Correct annual APTC</span>
              <strong>{result.estimatedCorrectAnnualAptcAtActual !== undefined ? formatCurrency(result.estimatedCorrectAnnualAptcAtActual) : '—'}</strong>
            </div>
            <div>
              <span>Excess APTC</span>
              <strong>{result.estimatedExcessAptc !== undefined ? formatCurrency(result.estimatedExcessAptc) : '—'}</strong>
            </div>
            <div>
              <span>Estimated repayment exposure</span>
              <strong>{result.estimatedRepaymentExposure !== undefined ? formatCurrency(result.estimatedRepaymentExposure) : '—'}</strong>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
