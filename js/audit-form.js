// Vecturo Audit Request & Calendar Scheduler Engine
document.addEventListener('DOMContentLoaded', () => {
  const TARGET_EMAIL = 'vecturosupport@gmail.com';

  // Helper to send data to vecturosupport@gmail.com via formsubmit.co
  async function sendEmailToVecturo(data, subject) {
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: subject,
          _captcha: 'false',
          ...data
        })
      });
      return await response.json();
    } catch (err) {
      console.warn('Network dispatch fallback:', err);
      return null;
    }
  }

  // Multi-step form elements
  const auditForm = document.getElementById('vecturo-audit-form');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');
  const stepScan = document.getElementById('step-scan');
  const stepSuccess = document.getElementById('step-success');

  const toStep2Btn = document.getElementById('to-step-2-btn');
  const backToStep1Btn = document.getElementById('back-to-step-1-btn');
  const toStep3Btn = document.getElementById('to-step-3-btn');
  const backToStep2Btn = document.getElementById('back-to-step-2-btn');

  // Step 1 to Step 2
  if (toStep2Btn && step1 && step2) {
    toStep2Btn.addEventListener('click', () => {
      const bizName = document.getElementById('audit-biz-name');
      const city = document.getElementById('audit-city');
      if (bizName && !bizName.value.trim()) {
        bizName.focus();
        bizName.classList.add('border-red-500');
        return;
      }
      if (bizName) bizName.classList.remove('border-red-500');
      step1.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  // Back to Step 1
  if (backToStep1Btn && step1 && step2) {
    backToStep1Btn.addEventListener('click', () => {
      step2.classList.add('hidden');
      step1.classList.remove('hidden');
    });
  }

  // Step 2 to Step 3
  if (toStep3Btn && step2 && step3) {
    toStep3Btn.addEventListener('click', () => {
      step2.classList.add('hidden');
      step3.classList.remove('hidden');
    });
  }

  // Back to Step 2
  if (backToStep2Btn && step2 && step3) {
    backToStep2Btn.addEventListener('click', () => {
      step3.classList.add('hidden');
      step2.classList.remove('hidden');
    });
  }

  // Submit Audit and run simulated scan + email dispatch
  if (auditForm) {
    auditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('audit-email');
      const phone = document.getElementById('audit-phone');
      const bizName = document.getElementById('audit-biz-name');
      const city = document.getElementById('audit-city');
      const category = document.getElementById('audit-category');
      const currentUrl = document.getElementById('audit-current-url');
      const contactName = document.getElementById('audit-contact-name');
      const revenueNote = document.getElementById('form-revenue-note');
      const gbpChecked = document.querySelector('input[name="gbp_status"]:checked');

      if (!email || !email.value.trim()) {
        if (email) email.focus();
        return;
      }

      const auditPayload = {
        request_type: 'Free Digital Footprint & SEO Audit',
        business_name: bizName ? bizName.value : '',
        city_location: city ? city.value : '',
        category: category ? category.value : '',
        current_website: currentUrl ? currentUrl.value : 'None provided',
        google_maps_status: gbpChecked ? gbpChecked.value : 'unspecified',
        contact_person: contactName ? contactName.value : '',
        phone_number: phone ? phone.value : '',
        client_email: email.value,
        revenue_leak_note: revenueNote ? revenueNote.value : '',
        submitted_at: new Date().toLocaleString()
      };

      // Dispatch session/audit email to vecturosupport@gmail.com
      sendEmailToVecturo(auditPayload, `New Audit Request: ${auditPayload.business_name} (${auditPayload.city_location})`);

      // Hide step 3, show scan animation
      if (step3) step3.classList.add('hidden');
      if (stepScan) stepScan.classList.remove('hidden');

      const scanStatusText = document.getElementById('scan-status-text');
      const scanProgressBar = document.getElementById('scan-progress-bar');

      const steps = [
        { text: 'Connecting to Google Places & Local Search Index...', progress: '25%' },
        { text: 'Measuring competitor density within service radius...', progress: '50%' },
        { text: 'Evaluating mobile responsiveness & load friction...', progress: '75%' },
        { text: `Finalizing blueprint and emailing ${TARGET_EMAIL}...`, progress: '100%' }
      ];

      let currentStepIdx = 0;
      const interval = setInterval(() => {
        if (currentStepIdx < steps.length) {
          if (scanStatusText) scanStatusText.textContent = steps[currentStepIdx].text;
          if (scanProgressBar) scanProgressBar.style.width = steps[currentStepIdx].progress;
          currentStepIdx++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            if (stepScan) stepScan.classList.add('hidden');
            if (stepSuccess) stepSuccess.classList.remove('hidden');
            const targetBizDisplay = document.getElementById('success-biz-name');
            if (targetBizDisplay && bizName) {
              targetBizDisplay.textContent = bizName.value || 'Your Business';
            }
            if (window.showToast) {
              window.showToast(`Details successfully sent to ${TARGET_EMAIL}`);
            }
          }, 600);
        }
      }, 700);
    });
  }

  // Calendar Discovery Booking Logic
  const calendarSlots = document.querySelectorAll('.calendar-slot');
  let selectedSlot = '10:00 AM CST';

  calendarSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      calendarSlots.forEach(s => {
        s.classList.remove('bg-[#00D4B2]', 'text-[#0A2540]', 'font-bold', 'border-[#00D4B2]');
        s.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      slot.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');
      slot.classList.add('bg-[#00D4B2]', 'text-[#0A2540]', 'font-bold', 'border-[#00D4B2]');
      selectedSlot = slot.getAttribute('data-time') || slot.textContent.trim();

      const confirmBtn = document.getElementById('confirm-booking-btn');
      if (confirmBtn) {
        confirmBtn.removeAttribute('disabled');
        confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    });
  });

  const calendarBookingForm = document.getElementById('calendar-booking-form');
  if (calendarBookingForm) {
    calendarBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('session-name');
      const bizNameInput = document.getElementById('session-biz-name');
      const emailInput = document.getElementById('session-email');
      const phoneInput = document.getElementById('session-phone');
      const notesInput = document.getElementById('session-notes');
      const dateChecked = document.querySelector('input[name="call_date"]:checked');

      const selectedDate = dateChecked ? dateChecked.value : 'Upcoming Window';
      const bizName = bizNameInput ? bizNameInput.value.trim() : 'Local Business';
      const contactName = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const notes = notesInput ? notesInput.value.trim() : 'None provided';

      const sessionPayload = {
        event_type: '20-Minute Strategy Discovery Session',
        business_name: bizName,
        contact_person: contactName,
        contact_email: email,
        contact_phone: phone,
        selected_session_date: selectedDate,
        selected_session_time: selectedSlot,
        business_notes_and_goals: notes,
        notification_recipient: TARGET_EMAIL,
        booking_timestamp: new Date().toLocaleString()
      };

      // Send the session email directly to vecturosupport@gmail.com
      sendEmailToVecturo(sessionPayload, `New Discovery Session Booking: ${bizName} - ${selectedSlot} (${selectedDate})`);

      // UI State Transition
      const calendarSuccess = document.getElementById('calendar-success');
      const calendarPicker = document.getElementById('calendar-picker');
      const bookedTimeText = document.getElementById('booked-slot-text');

      if (calendarPicker) calendarPicker.classList.add('hidden');
      if (calendarSuccess) calendarSuccess.classList.remove('hidden');
      if (bookedTimeText) {
        bookedTimeText.textContent = `${selectedDate} at ${selectedSlot}`;
      }

      if (window.showToast) {
        window.showToast(`Session email sent to ${TARGET_EMAIL}`);
      }
    });
  }
});
