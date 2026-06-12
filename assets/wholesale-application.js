/**
 * Wholesale Application Form - Multi-step navigation
 */

function wholesaleGoToStep2() {
  const step1 = document.getElementById('wholesaleStep1');
  if (!step1) return;

  const requiredFields = step1.querySelectorAll('[required]');
  let allValid = true;
  let firstError = null;

  requiredFields.forEach(function (field) {
    if (!field.value.trim()) {
      allValid = false;
      field.classList.add('field-error');
      if (!firstError) firstError = field;
    } else {
      field.classList.remove('field-error');
    }
  });

  if (!allValid) {
    if (firstError) firstError.focus();
    return;
  }

  // Save step 1 data to sessionStorage so browser back-button restores it
  try {
    var step1Data = {};
    step1.querySelectorAll('input[id], select[id], textarea[id]').forEach(function (el) {
      step1Data[el.id] = el.value;
    });
    sessionStorage.setItem('wholesale_step1_data', JSON.stringify(step1Data));
  } catch (e) {}

  document.getElementById('wholesaleStep1').classList.remove('active');
  document.getElementById('wholesaleStep2').classList.add('active');

  var step1Item = document.querySelector('[data-step="1"]');
  var step2Item = document.querySelector('[data-step="2"]');
  if (step1Item) {
    step1Item.classList.add('completed');
    step1Item.classList.remove('active');
  }
  if (step2Item) {
    step2Item.classList.add('active');
  }

  var progressSteps = document.getElementById('wholesaleProgressSteps');
  if (progressSteps) progressSteps.classList.add('step-2');

  var wrapper = document.querySelector('.wholesale-form-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth' });
}

function wholesaleGoToStep1() {
  document.getElementById('wholesaleStep2').classList.remove('active');
  document.getElementById('wholesaleStep1').classList.add('active');

  var step1Item = document.querySelector('[data-step="1"]');
  var step2Item = document.querySelector('[data-step="2"]');
  if (step1Item) {
    step1Item.classList.remove('completed');
    step1Item.classList.add('active');
  }
  if (step2Item) {
    step2Item.classList.remove('active');
  }

  var progressSteps = document.getElementById('wholesaleProgressSteps');
  if (progressSteps) progressSteps.classList.remove('step-2');

  // Restore step 1 values (handles both the form Back button and browser back)
  _wholesaleRestoreStep1();

  var wrapper = document.querySelector('.wholesale-form-wrapper');
  if (wrapper) wrapper.scrollIntoView({ behavior: 'smooth' });
}

function _wholesaleRestoreStep1() {
  try {
    var saved = sessionStorage.getItem('wholesale_step1_data');
    if (!saved) return;
    var data = JSON.parse(saved);
    Object.keys(data).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && data[id]) el.value = data[id];
    });
  } catch (e) {}
}

document.addEventListener('DOMContentLoaded', function () {
  // Disable browser native validation — JS handles all validation
  var formEl = document.getElementById('WholesaleApplicationForm');
  if (formEl) formEl.setAttribute('novalidate', '');

  // Restore step 1 data on page load — handles browser back-button scenario
  _wholesaleRestoreStep1();

  // Phone formatting
  var phoneInput = document.getElementById('WholesaleApplicationForm-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) val = val.slice(0, 10);
      if (val.length >= 7) {
        val = '(' + val.slice(0, 3) + ') ' + val.slice(3, 6) + '-' + val.slice(6);
      } else if (val.length >= 4) {
        val = '(' + val.slice(0, 3) + ') ' + val.slice(3);
      } else if (val.length > 0) {
        val = '(' + val;
      }
      e.target.value = val;
    });
  }

  // Clear radio-error on selection
  document.querySelectorAll('#wholesaleStep2 input[type="radio"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      var group = this.closest('.wholesale-radio-group');
      if (group) group.classList.remove('radio-error');
    });
  });

  // Clear field-error highlight on input
  document.querySelectorAll('#wholesaleStep1 .field__input, #wholesaleStep2 .field__input').forEach(function (input) {
    input.addEventListener('input', function () {
      this.classList.remove('field-error');
    });
    input.addEventListener('change', function () {
      this.classList.remove('field-error');
    });
  });

  var form = document.getElementById('WholesaleApplicationForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    var step2 = document.getElementById('wholesaleStep2');

    // If step 2 is not active (e.g. user pressed Enter in a step 1 field),
    // treat it as clicking "Next" — never allow a silent step-1 submit to slip through
    if (!step2 || !step2.classList.contains('active')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      wholesaleGoToStep2();
      return;
    }

    // --- Step 2 validation ---
    var step2RequiredIds = [
      'WholesaleApplicationForm-legal-name',
      'WholesaleApplicationForm-tax-id',
      'WholesaleApplicationForm-shipping-address',
      'WholesaleApplicationForm-city',
      'WholesaleApplicationForm-state',
      'WholesaleApplicationForm-zip',
      'WholesaleApplicationForm-business-hours'
    ];

    var allValid = true;
    var firstError = null;

    step2RequiredIds.forEach(function (id) {
      var field = document.getElementById(id);
      if (field && !field.value.trim()) {
        allValid = false;
        field.classList.add('field-error');
        if (!firstError) firstError = field;
      } else if (field) {
        field.classList.remove('field-error');
      }
    });

    // Validate radio groups
    var commercialRadios = document.querySelectorAll('[name="contact[Commercial Location]"]');
    var loadingDockRadios = document.querySelectorAll('[name="contact[Loading Dock]"]');

    var commercialChecked = Array.from(commercialRadios).some(function (r) { return r.checked; });
    var loadingChecked = Array.from(loadingDockRadios).some(function (r) { return r.checked; });

    var commercialGroup = commercialRadios.length ? commercialRadios[0].closest('.wholesale-radio-group') : null;
    var loadingGroup = loadingDockRadios.length ? loadingDockRadios[0].closest('.wholesale-radio-group') : null;

    if (!commercialChecked) {
      allValid = false;
      if (commercialGroup) {
        commercialGroup.classList.add('radio-error');
        if (!firstError) firstError = commercialGroup;
      }
    } else if (commercialGroup) {
      commercialGroup.classList.remove('radio-error');
    }

    if (!loadingChecked) {
      allValid = false;
      if (loadingGroup) {
        loadingGroup.classList.add('radio-error');
        if (!firstError) firstError = loadingGroup;
      }
    } else if (loadingGroup) {
      loadingGroup.classList.remove('radio-error');
    }

    if (!allValid) {
      e.preventDefault();
      e.stopImmediatePropagation();
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // All valid — disable button to prevent double-submit and clear saved step 1 data
    var submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';
    }
    try { sessionStorage.removeItem('wholesale_step1_data'); } catch (e) {}
  });
});
