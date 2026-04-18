import type { ChangeEvent } from 'react';
import type { FilingStatus, HouseholdInput, ScenarioInput } from '../lib/types';

interface Props {
  household: HouseholdInput;
  scenarioA: ScenarioInput;
  scenarioB: ScenarioInput;
  onHouseholdChange: (field: keyof HouseholdInput, value: string | number) => void;
  onScenarioChange: (scenario: 'A' | 'B', field: keyof ScenarioInput, value: string | number | undefined) => void;
  onLoadSample: () => void;
  onReset: () => void;
}

const filingStatusOptions: Array<{ value: FilingStatus; label: string }> = [
  { value: 'single', label: 'Single' },
  { value: 'married_joint', label: 'Married filing jointly' },
  { value: 'head_of_household', label: 'Head of household' },
];

function numericValue(event: ChangeEvent<HTMLInputElement>): number {
  return Number(event.target.value || 0);
}

export default function InputSection({
  household,
  scenarioA,
  scenarioB,
  onHouseholdChange,
  onScenarioChange,
  onLoadSample,
  onReset,
}: Props) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Agent inputs</h2>
          <p>Use good-faith income scenarios to compare subsidy, CSR, and repayment exposure.</p>
        </div>
        <div className="button-row">
          <button type="button" className="secondary-button" onClick={onLoadSample}>Load sample</button>
          <button type="button" className="secondary-button" onClick={onReset}>Reset</button>
        </div>
      </div>

      <div className="grid two-column">
        <label>
          Household size
          <input type="number" min="1" value={household.householdSize} onChange={(e) => onHouseholdChange('householdSize', numericValue(e))} />
        </label>
        <label>
          Filing status
          <select value={household.filingStatus} onChange={(e) => onHouseholdChange('filingStatus', e.target.value)}>
            {filingStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          State
          <input value={household.stateCode} maxLength={2} onChange={(e) => onHouseholdChange('stateCode', e.target.value.toUpperCase())} placeholder="FL" />
        </label>
        <label>
          ZIP code
          <input value={household.zipCode} onChange={(e) => onHouseholdChange('zipCode', e.target.value)} placeholder="33101" />
        </label>
        <label>
          County
          <input value={household.county} onChange={(e) => onHouseholdChange('county', e.target.value)} placeholder="Miami-Dade" />
        </label>
        <label>
          Months covered
          <input type="number" min="1" max="12" value={household.monthsCovered} onChange={(e) => onHouseholdChange('monthsCovered', numericValue(e))} />
        </label>
        <label className="span-two">
          Ages in household
          <input value={household.ages} onChange={(e) => onHouseholdChange('ages', e.target.value)} placeholder="35, 34, 2" />
        </label>
        <label className="span-two">
          Monthly benchmark premium estimate
          <input type="number" min="0" value={household.monthlyBenchmarkPremium} onChange={(e) => onHouseholdChange('monthlyBenchmarkPremium', numericValue(e))} />
        </label>
      </div>

      <div className="grid two-column scenario-grid">
        <div className="scenario-box">
          <h3>Scenario A</h3>
          <label>
            Projected income
            <input type="number" min="0" value={scenarioA.projectedIncome} onChange={(e) => onScenarioChange('A', 'projectedIncome', numericValue(e))} />
          </label>
          <label>
            Expected actual year-end income
            <input type="number" min="0" value={scenarioA.expectedActualIncome ?? ''} onChange={(e) => onScenarioChange('A', 'expectedActualIncome', e.target.value === '' ? undefined : numericValue(e))} />
          </label>
        </div>
        <div className="scenario-box">
          <h3>Scenario B</h3>
          <label>
            Projected income
            <input type="number" min="0" value={scenarioB.projectedIncome} onChange={(e) => onScenarioChange('B', 'projectedIncome', numericValue(e))} />
          </label>
          <label>
            Expected actual year-end income
            <input type="number" min="0" value={scenarioB.expectedActualIncome ?? ''} onChange={(e) => onScenarioChange('B', 'expectedActualIncome', e.target.value === '' ? undefined : numericValue(e))} />
          </label>
        </div>
      </div>
    </section>
  );
}
