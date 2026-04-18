import { useMemo, useState } from 'react';
import ComparisonSummary from './components/ComparisonSummary';
import InputSection from './components/InputSection';
import ScenarioCard from './components/ScenarioCard';
import { calculateScenario, getStateRegionLabel } from './lib/calculations';
import type { HouseholdInput, ScenarioInput } from './lib/types';

const defaultHousehold: HouseholdInput = {
  householdSize: 3,
  ages: '35, 34, 2',
  stateCode: 'FL',
  zipCode: '33101',
  county: 'Miami-Dade',
  monthsCovered: 12,
  filingStatus: 'married_joint',
  monthlyBenchmarkPremium: 2200,
};

const defaultScenarioA: ScenarioInput = {
  label: 'Scenario A',
  projectedIncome: 49000,
  expectedActualIncome: 90000,
};

const defaultScenarioB: ScenarioInput = {
  label: 'Scenario B',
  projectedIncome: 90000,
  expectedActualIncome: 90000,
};

export default function App() {
  const [household, setHousehold] = useState<HouseholdInput>(defaultHousehold);
  const [scenarioA, setScenarioA] = useState<ScenarioInput>(defaultScenarioA);
  const [scenarioB, setScenarioB] = useState<ScenarioInput>(defaultScenarioB);

  const resultA = useMemo(() => calculateScenario(household, scenarioA), [household, scenarioA]);
  const resultB = useMemo(() => calculateScenario(household, scenarioB), [household, scenarioB]);

  return (
    <main className="app-shell">
      <section className="hero panel">
        <div>
          <p className="eyebrow">ACA agent scenario planner</p>
          <h1>Compare income scenarios before you quote</h1>
          <p className="hero-text">
            Estimate subsidy, CSR tier, premium difference, and repayment exposure using 2026 assumptions.
          </p>
        </div>
        <div className="hero-note">
          <strong>FPL table in use:</strong>
          <span>2025 guidelines for {getStateRegionLabel(household.stateCode)}.</span>
        </div>
      </section>

      <InputSection
        household={household}
        scenarioA={scenarioA}
        scenarioB={scenarioB}
        onHouseholdChange={(field, value) => setHousehold((prev) => ({ ...prev, [field]: value }))}
        onScenarioChange={(scenario, field, value) => {
          if (scenario === 'A') {
            setScenarioA((prev) => ({ ...prev, [field]: value }));
            return;
          }
          setScenarioB((prev) => ({ ...prev, [field]: value }));
        }}
        onLoadSample={() => {
          setHousehold(defaultHousehold);
          setScenarioA(defaultScenarioA);
          setScenarioB(defaultScenarioB);
        }}
        onReset={() => {
          setHousehold({
            ...defaultHousehold,
            householdSize: 1,
            ages: '',
            stateCode: 'FL',
            zipCode: '',
            county: '',
            monthlyBenchmarkPremium: 0,
          });
          setScenarioA({ label: 'Scenario A', projectedIncome: 0, expectedActualIncome: undefined });
          setScenarioB({ label: 'Scenario B', projectedIncome: 0, expectedActualIncome: undefined });
        }}
      />

      <section className="results-grid">
        <ScenarioCard result={resultA} />
        <ScenarioCard result={resultB} />
      </section>

      <ComparisonSummary a={resultA} b={resultB} />

      <section className="panel disclaimer-panel">
        <h2>Important</h2>
        <p>
          This tool is for good-faith Marketplace planning and quoting. It is an estimate only and not tax or legal advice.
          Final Premium Tax Credit reconciliation is determined on IRS Form 8962 using official Marketplace data, including the benchmark premium.
        </p>
        <p>
          For tax years after 2025, IRS guidance states there is no repayment cap on excess advance Premium Tax Credit, and households above 400% of FPL are generally not eligible for PTC.
        </p>
      </section>
    </main>
  );
}
