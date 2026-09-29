/**
 * DIGIT MAXZ - INTERACTIVE GROWTH & LEAD ROI CALCULATOR
 * Calculates estimated leads, pipeline value, and ROI based on budget and objective.
 */

document.addEventListener('DOMContentLoaded', () => {
  const budgetRange = document.getElementById('calcBudgetRange');
  const budgetDisplay = document.getElementById('calcBudgetValue');
  const leadsDisplay = document.getElementById('calcLeadsValue');
  const pipelineDisplay = document.getElementById('calcPipelineValue');
  const roiDisplay = document.getElementById('calcRoiMultiple');
  const ctaBtn = document.getElementById('calcCtaBtn');

  if (!budgetRange || !budgetDisplay) return;

  function updateCalculator() {
    const budget = parseInt(budgetRange.value, 10);
    budgetDisplay.textContent = `$${budget.toLocaleString()}/mo`;

    // Realistic modeling for B2B/tech/enterprise lead acquisition
    // Blended cost per qualified sales lead: ~$75 to ~$120 depending on scale & AI optimization
    const estCostPerLead = budget < 3000 ? 95 : (budget < 8000 ? 82 : 70);
    const estLeads = Math.round(budget / estCostPerLead);

    // Average client deal value multiplier: 4x to 7x pipeline value
    const pipelineMultiplier = budget < 5000 ? 4.8 : 6.2;
    const estPipeline = Math.round(budget * pipelineMultiplier);

    // Projected ROI multiple
    const roiMultiple = (pipelineMultiplier * 0.85).toFixed(1);

    if (leadsDisplay) {
      leadsDisplay.textContent = `${estLeads}+ Leads`;
    }
    if (pipelineDisplay) {
      pipelineDisplay.textContent = `$${estPipeline.toLocaleString()}`;
    }
    if (roiDisplay) {
      roiDisplay.textContent = `${roiMultiple}x Est. Pipeline ROI`;
    }

    if (ctaBtn) {
      // Map to closest modal budget tier
      let budgetTier = '$1,000 - $3,000';
      if (budget >= 10000) budgetTier = '$10,000+';
      else if (budget >= 5000) budgetTier = '$5,000 - $10,000';
      else if (budget >= 3000) budgetTier = '$3,000 - $5,000';

      ctaBtn.setAttribute('data-budget', budgetTier);
      ctaBtn.setAttribute('data-cta-text', `Get My Growth Plan for $${budget.toLocaleString()}/mo`);
      ctaBtn.setAttribute('data-modal-title', `Custom Growth Plan ($${budget.toLocaleString()}/mo)`);
    }
  }

  budgetRange.addEventListener('input', updateCalculator);
  updateCalculator();
});
