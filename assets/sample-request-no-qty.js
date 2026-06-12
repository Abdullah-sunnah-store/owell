/**
 * Quote Request Form (No Quantity) - Dynamic Sample Items
 */

let noQtyItemCount = 1;

function updateNoQtyUI() {
  const countEl = document.getElementById('noQtyItemCount');
  if (countEl) countEl.textContent = noQtyItemCount;

  const items = document.querySelectorAll('#sampleItemsNoQty .quote-item');
  items.forEach((item) => {
    const removeBtn = item.querySelector('.quote-item-remove');
    if (removeBtn) removeBtn.disabled = items.length === 1;
  });
}

function addNoQtyItem() {
  noQtyItemCount++;

  const container = document.getElementById('sampleItemsNoQty');
  if (!container) return;

  const div = document.createElement('div');
  div.className = 'quote-item';
  div.dataset.item = noQtyItemCount;
  div.innerHTML = `
    <div class="quote-item-number">${noQtyItemCount}</div>
    <div class="quote-item-body">
      <div class="form-group">
        <label class="field__label" for="SampleRequestFormNoQty-item-${noQtyItemCount}">
          Item # <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestFormNoQty-item-${noQtyItemCount}"
          class="field__input"
          name="contact[Sample Item ${noQtyItemCount} - SKU]"
          placeholder="e.g. OW-GL-100"
          required
          aria-required="true"
        >
      </div>
      <div class="form-group">
        <label class="field__label" for="SampleRequestFormNoQty-size-${noQtyItemCount}">
          Size <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestFormNoQty-size-${noQtyItemCount}"
          class="field__input"
          name="contact[Sample Item ${noQtyItemCount} - Size]"
          placeholder="e.g. M, L, XL"
          required
          aria-required="true"
        >
        <span class="quote-size-hint">e.g. S, M, L, XL, One Size</span>
      </div>
      <div class="form-group">
        <label class="field__label" for="SampleRequestFormNoQty-qty-${noQtyItemCount}">
          Qty <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="SampleRequestFormNoQty-qty-${noQtyItemCount}"
          class="field__input"
          name="contact[Sample Item ${noQtyItemCount} - Qty]"
          placeholder="e.g. 1 box, 50 pcs"
          required
          aria-required="true"
        >
      </div>
      <div class="form-group">
        <label class="field__label" for="SampleRequestFormNoQty-target-price-${noQtyItemCount}">
          Target Price
        </label>
        <input
          type="text"
          id="SampleRequestFormNoQty-target-price-${noQtyItemCount}"
          class="field__input"
          name="contact[Sample Item ${noQtyItemCount} - Target Price]"
          placeholder="e.g. $12.50 / case"
        >
      </div>
    </div>
    <button type="button" class="quote-item-remove" onclick="removeNoQtyItem(this)" title="Remove">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  container.appendChild(div);
  div.querySelector('input').focus();
  updateNoQtyUI();
}

function removeNoQtyItem(btn) {
  const items = document.querySelectorAll('#sampleItemsNoQty .quote-item');
  if (items.length <= 1) return;

  btn.closest('.quote-item').remove();
  noQtyItemCount = document.querySelectorAll('#sampleItemsNoQty .quote-item').length;
  updateNoQtyUI();
}

document.addEventListener('DOMContentLoaded', function () {
  const phoneInput = document.getElementById('SampleRequestFormNoQty-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
      let val = e.target.value.replace(/\D/g, '');
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

  updateNoQtyUI();
});
