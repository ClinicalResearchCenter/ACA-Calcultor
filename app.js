const CURRENCY = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const PTC_CONFIG = {
  2026: {
    planYear: 2026,
    fplBasisYear: 2025,
    hasRepaymentCap: false,
    repaymentCaps: null,
    povertyGuidelines: {
      contiguous: { 1: 15650, 2: 21150, 3: 26650, 4: 32150, 5: 37650, 6: 43150, 7: 48650, 8: 54150, addl: 5500 },
      alaska: { 1: 19550, 2: 26430, 3: 33310, 4: 40190, 5: 47070, 6: 53950, 7: 60830, 8: 67710, addl: 6880 },
      hawaii: { 1: 17990, 2: 24320, 3: 30650, 4: 36980, 5: 43310, 6: 49640, 7: 55970, 8: 62300, addl: 6330 },
    },
    applicablePercentageTable: [
      { min: 0, max: 1.33, initial: 0.0210, final: 0.0210 },
      { min: 1.33, max: 1.5, initial: 0.0314, final: 0.0419 },
      { min: 1.5, max: 2.0, initial: 0.0419, final: 0.0660 },
      { min: 2.0, max: 2.5, initial: 0.0660, final: 0.0844 },
      { min: 2.5, max: 3.0, initial: 0.0844, final: 0.0996 },
      { min: 3.0, max: 4.0, initial: 0.0996, final: 0.0996 },
    ],
  },
};

function getPovertyGuideline(config, region, householdSize) {
  const table = config.povertyGuidelines[region];
  if (householdSize <= 8) return table[householdSize];
  return table[8] + (householdSize - 8) * table.addl;
}

function getApplicablePercentage(config, fplRatio, hasBelow100Exception) {
  if (fplRatio < 1) {
    return hasBelow100Exception ? 0.0210 : null;
  }
  if (fplRatio > 4) {
    return null;
  }

  const row = config.applicablePercentageTable.find((band) => fplRatio >= band.min && fplRatio < band.max)
    || config.applicablePercentageTable[config.applicablePercentageTable.length - 1];

  if (row.initial === row.final) {
    return row.initial;
  }

  const bandWidth = row.max - row.min;
  const position = (fplRatio - row.min) / bandWidth;
  return row.initial + ((row.final - row.initial) * position);
}

function calculateRepayment(input) {
  const config = PTC_CONFIG[input.coverageYear];
  const povertyGuideline = getPovertyGuideline(config, input.region, input.householdSize);
  const fplRatio = input.householdIncome / povertyGuideline;
  const fplPercent = Math.floor(fplRatio * 100);
  const applicablePct = getApplicablePercentage(config, fplRatio, input.below100Exception);

  const eligibleForPTC = applicablePct !== null;
  const expectedContribution = eligibleForPTC ? input.householdIncome * applicablePct : 0;
  const allowedPTC = eligibleForPTC
    ? Math.max(0, input.annualBenchmarkPremium - expectedContribution)
    : 0;

  const excessAptc = Math.max(0, input.annualAptc - allowedPTC);
  const netAdditionalCredit = Math.max(0, allowedPTC - input.annualAptc);

  let repaymentCap = null;
  let repaymentAmount = excessAptc;

  if (config.hasRepaymentCap && excessAptc > 0) {
    const tier = fplPercent < 200 ? "lt200" : fplPercent < 300 ? "lt300" : fplPercent < 400 ? "lt400" : null;
    if (tier) {
      repaymentCap = config.repaymentCaps[input.filingStatus][tier];
      repaymentAmount = Math.min(excessAptc, repaymentCap);
    }
  }

  return {
    config,
    povertyGuideline,
    fplRatio,
    fplPercent,
    applicablePct,
    eligibleForPTC,
    expectedContribution,
    allowedPTC,
    excessAptc,
    netAdditionalCredit,
    repaymentCap,
    repaymentAmount,
  };
}

function formatCurrency(value) {
  return CURRENCY.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(decimal) {
  if (decimal === null || decimal === undefined) return "Not eligible";
  return `${(decimal * 100).toFixed(2)}%`;
}

function getRiskClass(result) {
  if (result.excessAptc === 0 && result.netAdditionalCredit > 0) return "result-good";
  if (result.excessAptc === 0) return "result-good";
  if (result.excessAptc <= 1000) return "result-warn";
  return "result-bad";
}

function renderResults(result, input) {
  const riskClass = getRiskClass(result);
  const benchmarkMonthly = input.annualBenchmarkPremium / input.monthsCovered;
  const aptcMonthly = input.annualAptc / input.monthsCovered;

  const eligibilityText = result.eligibleForPTC
    ? `Eligible under the 2026 plan-year income rules.`
    : `Not eligible for PTC under standard 2026 rules based on these inputs.`;

  const capText = result.config.hasRepaymentCap
    ? (result.repaymentCap ? `Repayment cap applied: ${formatCurrency(result.repaymentCap)}.` : `No repayment cap applied.`)
    : `For Plan Year 2026, there is no excess APTC repayment cap.`;

  return `
    <div class="stat ${riskClass}">
      <div class="stat-label">Estimated amount owed at filing</div>
      <div class="stat-value">${formatCurrency(result.repaymentAmount)}</div>
      <div class="stat-sub">${capText}</div>
    </div>

    <div class="stat ${result.netAdditionalCredit > 0 ? "result-good" : ""}">
      <div class="stat-label">Allowed annual Premium Tax Credit</div>
      <div class="stat-value">${formatCurrency(result.allowedPTC)}</div>
      <div class="stat-sub">${eligibilityText}</div>
    </div>

    <div class="stat">
      <div class="stat-label">Household income as % of FPL</div>
      <div class="stat-value">${result.fplPercent}%</div>
      <div class="stat-sub">2026 plan-year eligibility uses the ${result.config.fplBasisYear} poverty guideline for the selected region.</div>
    </div>

    <div class="stat">
      <div class="stat-label">Applicable percentage</div>
      <div class="stat-value">${formatPercent(result.applicablePct)}</div>
      <div class="stat-sub">Expected annual household contribution: ${formatCurrency(result.expectedContribution)}</div>
    </div>

    <div class="stat">
      <div class="stat-label">Excess APTC</div>
      <div class="stat-value">${formatCurrency(result.excessAptc)}</div>
      <div class="stat-sub">Annual APTC received ${formatCurrency(input.annualAptc)} minus allowed PTC ${formatCurrency(result.allowedPTC)}</div>
    </div>

    <div class="stat">
      <div class="stat-label">Monthly context</div>
      <div class="stat-value">${formatCurrency(benchmarkMonthly)}</div>
      <div class="stat-sub">Benchmark premium per covered month. APTC per covered month: ${formatCurrency(aptcMonthly)}</div>
    </div>

    <div class="formula">
      <strong>Formula used</strong><br>
      FPL % = household income ÷ poverty guideline<br>
      Allowed PTC = max(0, annual benchmark premium − (household income × applicable percentage))<br>
      Excess APTC = max(0, annual APTC received − allowed PTC)<br>
      Repayment = ${result.config.hasRepaymentCap ? "min(excess APTC, repayment cap)" : "excess APTC"}
    </div>

    <p class="disclaimer">
      This calculator is designed for fast planning and client conversations. Exact tax filing outcomes can still change if Form 1095-A needs correction,
      if there were partial-month enrollments, shared policies, marriage changes, self-employment deduction feedback loops, or other Form 8962 adjustments.
    </p>
  `;
}

function readInput() {
  return {
    coverageYear: Number(document.getElementById("coverageYear").value),
    region: document.getElementById("region").value,
    householdSize: Number(document.getElementById("householdSize").value),
    filingStatus: document.getElementById("filingStatus").value,
    householdIncome: Number(document.getElementById("householdIncome").value),
    annualAptc: Number(document.getElementById("annualAptc").value),
    annualBenchmarkPremium: Number(document.getElementById("annualBenchmarkPremium").value),
    monthsCovered: Number(document.getElementById("monthsCovered").value),
    below100Exception: document.getElementById("below100Exception").checked,
  };
}

function handleSubmit(event) {
  event.preventDefault();
  const input = readInput();
  const result = calculateRepayment(input);
  document.getElementById("results").innerHTML = renderResults(result, input);
}

document.getElementById("calc-form").addEventListener("submit", handleSubmit);
handleSubmit(new Event("submit"));
