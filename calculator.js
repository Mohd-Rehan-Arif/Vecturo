// Vecturo Interactive Local Revenue Leak & Recovery Calculator
document.addEventListener('DOMContentLoaded', () => {
  const footfallSlider = document.getElementById('calc-footfall');
  const footfallVal = document.getElementById('calc-footfall-val');
  
  const ticketSlider = document.getElementById('calc-ticket');
  const ticketVal = document.getElementById('calc-ticket-val');

  const industrySelect = document.getElementById('calc-industry');

  const monthlyLeakDisplay = document.getElementById('calc-monthly-leak');
  const annualLeakDisplay = document.getElementById('calc-annual-leak');
  const recoveryDisplay = document.getElementById('calc-recovery-90d');
  const lostCustomersDisplay = document.getElementById('calc-lost-customers');

  if (!footfallSlider || !ticketSlider) return;

  const industryMultipliers = {
    'retail': { searchMultiplier: 2.1, captureRate: 0.38 },
    'healthcare': { searchMultiplier: 1.6, captureRate: 0.42 },
    'services': { searchMultiplier: 2.4, captureRate: 0.45 },
    'auto': { searchMultiplier: 1.9, captureRate: 0.40 },
    'other': { searchMultiplier: 1.8, captureRate: 0.35 }
  };

  function updateCalculations() {
    const footfall = parseInt(footfallSlider.value, 10);
    const ticket = parseInt(ticketSlider.value, 10);
    const industry = industrySelect ? industrySelect.value : 'retail';

    // Update text labels
    if (footfallVal) footfallVal.textContent = footfall.toLocaleString();
    if (ticketVal) ticketVal.textContent = `$${ticket.toLocaleString()}`;

    const config = industryMultipliers[industry] || industryMultipliers['retail'];
    
    // Estimate missed local searches based on physical footfall volume
    const potentialOnlineSearchers = Math.round(footfall * config.searchMultiplier);
    
    // Modern consumers (82%) search online before buying. Competitors with optimized sites siphon ~38-45% of them.
    const lostCustomersPerMonth = Math.round(potentialOnlineSearchers * 0.82 * config.captureRate * 0.12);
    const monthlyLostRevenue = lostCustomersPerMonth * ticket;
    const annualLostRevenue = monthlyLostRevenue * 12;
    const projected90DayRecovery = Math.round(monthlyLostRevenue * 0.65 * 3);

    // Format numbers
    if (lostCustomersDisplay) lostCustomersDisplay.textContent = lostCustomersPerMonth.toLocaleString();
    if (monthlyLeakDisplay) monthlyLeakDisplay.textContent = `$${monthlyLostRevenue.toLocaleString()}`;
    if (annualLeakDisplay) annualLeakDisplay.textContent = `$${annualLostRevenue.toLocaleString()}`;
    if (recoveryDisplay) recoveryDisplay.textContent = `$${projected90DayRecovery.toLocaleString()}`;
  }

  footfallSlider.addEventListener('input', updateCalculations);
  ticketSlider.addEventListener('input', updateCalculations);
  if (industrySelect) industrySelect.addEventListener('change', updateCalculations);

  // Initial calculation run
  updateCalculations();

  // CTA button auto-scrolls and presets form
  const claimButton = document.getElementById('calc-claim-btn');
  if (claimButton) {
    claimButton.addEventListener('click', (e) => {
      e.preventDefault();
      const auditFormSection = document.getElementById('audit-section');
      if (auditFormSection) {
        auditFormSection.scrollIntoView({ behavior: 'smooth' });
        const revenueNote = document.getElementById('form-revenue-note');
        if (revenueNote) {
          revenueNote.value = `Estimated Annual Leak: ${annualLeakDisplay ? annualLeakDisplay.textContent : '$50k+'}`;
        }
      }
    });
  }
});
