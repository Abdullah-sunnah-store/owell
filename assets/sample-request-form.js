/**
 * Sample Request Form - Dynamic Sample Items
 */

let sampleItemCount = 1;

function updateSampleUI() {
  const countElement = document.getElementById('itemCount');
  if (countElement) {
    countElement.textContent = sampleItemCount;
  }

  const items = document.querySelectorAll('.sample-item');
  items.forEach((item) => {
    const removeBtn = item.querySelector('.sample-item-remove');
    if (removeBtn) {
      removeBtn.disabled = items.length === 1;
    }
  });
}

function addSampleItem() {
  sampleItemCount++;
  const container = document.getElementById('sampleItems');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'sample-item';
  div.dataset.item = sampleItemCount;
  div.innerHTML = `
    <div class="sample-item-body">
      <div class="form-group">
        <label class="field__label" for="SampleRequestForm-item-${sampleItemCount}">
          Item # <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestForm-item-${sampleItemCount}"
          class="field__input"
          name="contact[Sample Item ${sampleItemCount} - SKU]"
          placeholder="e.g. OW-GL-100"
          required
          aria-required="true"
        >
      </div>
      <div class="form-group">
        <label class="field__label" for="SampleRequestForm-size-${sampleItemCount}">
          Size <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestForm-size-${sampleItemCount}"
          class="field__input"
          name="contact[Sample Item ${sampleItemCount} - Size]"
          placeholder="e.g. M, L, XL"
          required
          aria-required="true"
        >
        <span class="size-hint">e.g. S, M, L, XL, One Size</span>
      </div>
      <div class="form-group">
        <label class="field__label" for="SampleRequestForm-qty-${sampleItemCount}">
          Quantity <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestForm-qty-${sampleItemCount}"
          class="field__input"
          name="contact[Sample Item ${sampleItemCount} - Quantity]"
          placeholder="e.g. 1 box, 50 pcs"
          required
          aria-required="true"
        >
      </div>
    </div>
    <button type="button" class="sample-item-remove" onclick="removeSampleItem(this)" title="Remove">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  container.appendChild(div);

  // Focus on the first input of the new item
  const firstInput = div.querySelector('input');
  if (firstInput) {
    firstInput.focus();
  }

  updateSampleUI();
}

function removeSampleItem(btn) {
  const items = document.querySelectorAll('.sample-item');
  if (items.length <= 1) return;

  const item = btn.closest('.sample-item');
  if (item) {
    item.remove();
    sampleItemCount = document.querySelectorAll('.sample-item').length;
    updateSampleUI();
  }
}

// Phone number formatting
function formatPhoneNumber(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 10) val = val.slice(0, 10);

  if (val.length >= 7) {
    val = '(' + val.slice(0, 3) + ') ' + val.slice(3, 6) + '-' + val.slice(6);
  } else if (val.length >= 4) {
    val = '(' + val.slice(0, 3) + ') ' + val.slice(3);
  } else if (val.length > 0) {
    val = '(' + val;
  }

  input.value = val;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function () {
  // Initialize phone formatting
  const phoneInput = document.getElementById('SampleRequestForm-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      formatPhoneNumber(e.target);
    });
  }

  // Initialize UI
  updateSampleUI();
});
