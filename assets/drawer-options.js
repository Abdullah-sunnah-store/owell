// Will handle product options drawer rendering
const optionDrawerEvents = {
    hideDrawer: 'action:hideDrawer',
};
// Requires single products object to render data
class DrawerOptions extends HTMLElement {
    constructor() {
        super();
        this.productData;
        this.imageWrapperEl = this.querySelector('[product-image]');
        this.drawerVariantSelectorType = this.getAttribute(
            'drawer-variant-selector-type'
        );
        this.optionsVariantSelector = this.querySelector(
            '[drawer-variant-selector]'
        );
        this.productPriceWrapper = this.querySelector(
            '[product-price-wrapper]'
        );
        this.productTextElement = {
            productTitle: this.querySelector('[product-title]'),
            productPrice: this.querySelector('[product-price]'),
            productComparePrice: this.querySelector('[product-compare-price]'),
            productPercentage: this.querySelector(
                '[product-discount-percentage]'
            ),
            productVendor: this.querySelector('[product-vendor]'),
        };
        document.addEventListener(optionDrawerEvents.hideDrawer, (e) => {
            if (e.detail.drawerType === 'options') this._resetOptions();
        });
    }

    // Intitialization function that will be called to render all products data
    _renderOptionsElements(componentInstance) {
        this._setProductDataProps(componentInstance);
        this._updateProductId();
        this._updateProductImage();
        this._updateProductTitle();
        this._updateProductVendor();
        this._updateProductPrice();
        this._generateVariantSelector();
    }

    // Look For product json data and set the data to global class properties
    _setProductDataProps(elInstance) {
        const productData =
            elInstance.querySelector('[product-data]').textContent;
        // const productFirstVariantData = elInstance.querySelector(
        //     '[product-firstVaraintData]'
        // ).textContent;
        const productJson = JSON.parse(productData);
        // const productFirstVariantJson = JSON.parse(productFirstVariantData);
        this.productData = productJson;
        // this.productfirstVariantData = productFirstVariantJson;
    }

    // Update product image
    _updateProductImage() {
        // const { imgUrl: featured_image, title } = this.productData;
        // const imageWrapperEl = this.querySelector('[product-image]');
        const imageEL = new Image();
        imageEL.onload = () => {
            this.imageWrapperEl.append(imageEL);
        };
        imageEL.classList.add('image-responsive');
        imageEL.src = this.productData.product.featured_image;
        imageEL.alt = this.productData.product.title;
    }

    // Update product title
    _updateProductTitle() {
        this.productTextElement.productTitle.textContent =
            this.productData.product.title;
    }

    _updateProductVendor() {
        if (
            this.productTextElement.productVendor &&
            this.productData.product.vendor.length > 0
        ) {
            this.productTextElement.productVendor.textContent =
                this.productData.product.vendor;
        }
    }

    // Update product price
    _updateProductPrice(productData) {
        const product =
            productData || this.productData.productFirstAvailableVariant;
        // const { productFirstAvailableVariant } = this.productData;
        const { isproductOnDiscount, discountPercentage } =
            HELPER_UTIL.productPriceUtil(product).productDiscountData;
        // Show actual price
        this.productTextElement.productPrice.textContent = Shopify.formatMoney(
            product.price,
            Shopify.money_format
        );
        // Show discount price
        if (isproductOnDiscount) {
            // Show compare price
            this.productTextElement.productComparePrice.textContent =
                Shopify.formatMoney(
                    product.compare_at_price,
                    Shopify.money_format
                );
            this.productTextElement.productPercentage.textContent =
                discountPercentage + '%';
        }
    }

    _generateVariantSelectorElementBasedonType(type) {
        switch (type) {
            case 'dropdown':
                return this._generateDropDownSelector();
            case 'pills':
                return this._generatePillsSelector();
        }
    }

    _generatePillsSelector() {
        const generateVariantSelector = new DrawerVaraintPillSelector();
        const { productOptionsData, productFirstAvailableVariant } =
            this.productData;
        generateVariantSelector.innerHTML = productOptionsData
            .map((option) => {
                return `<fieldset product-variant-option>
                <legend class="mb-2">${option.name}</legend>
                    ${option.values
                        .map((value, i) => {
                            return `<input type="radio" id="option-${
                                option.position
                            }-${i}" ${
                                productFirstAvailableVariant.options.includes(
                                    value
                                )
                                    ? 'checked'
                                    : ''
                            } name="${
                                option.name
                            }" value="${value}" aria-hidden="true"> <label class="fnt-16 text-center text-capitalize" for="option-${
                                option.position
                            }-${i}" tabindex="0">${value}</label>`;
                        })
                        .join('')}</fieldset>`;
            })
            .join('');
        return generateVariantSelector;
    }

    _generateDropDownSelector() {
        const generateVariantSelector = new DrawerVaraintDropDownSelector();
        const { productOptionsData } = this.productData;
        generateVariantSelector.innerHTML = productOptionsData
            .map((option) => {
                return `<div  product-variant-option><label class="select__label d-block mb-2" for="optio-${
                    option.position
                }">${
                    option.name
                }</label><select class="select mb-16" id="option-${
                    option.position
                }" name="option[${option.name}]">
                    ${option.values
                        .map((value) => {
                            return `<option value="${value}">${value}</option>`;
                        })
                        .join('')}
                </select></div>`;
            })
            .join('');
        return generateVariantSelector;
    }

    _generateVariantSelector() {
        // _generateVariantSelectorElementBasedonType argument will be dyanamic based on customization settings added for options drawer
        const varinatSelectorElement =
            this._generateVariantSelectorElementBasedonType(
                this.drawerVariantSelectorType
            );
        const productVariantsData = this.productData.product.variants;
        varinatSelectorElement._updateVariantStatuses(productVariantsData);
        this.optionsVariantSelector
            .querySelector('form')
            .append(varinatSelectorElement);
    }

    _updateProductId() {
        const { productFirstAvailableVariant } = this.productData;
        const inputIDEl = this.querySelector('[name="id"]');
        inputIDEl.value = productFirstAvailableVariant.id;
    }

    // Reset data inside options drawer once drawer is closed
    _resetOptions() {
        setTimeout(() => {
            // Set Add button default State
            const addButton = this.querySelector('[name=add]');
            const addButtonText = addButton.querySelector('.btn--text');
            HELPER_UTIL.submitButtonState(addButton).disableState(false);
            addButtonText.textContent = window.variantStrings.addToCart;
            // Set image default State
            this.imageWrapperEl.querySelector('img').remove();
            Object.values(this.productTextElement).forEach((el) => {
                el.textContent = '';
            });
            this.productPriceWrapper.classList.remove('visibility-hidden');
            // Remove variant selector to render new one on load
            if (this.querySelector('drawer-variant-dropdown-selector')) {
                this.querySelector('drawer-variant-dropdown-selector').remove();
            }
            if (this.querySelector('drawer-variant-pills-selector')) {
                this.querySelector('drawer-variant-pills-selector').remove();
            }
        }, 400);
    }
}

customElements.get('drawer-options') ||
    customElements.define('drawer-options', DrawerOptions);

class DrawerVaraintDropDownSelector extends HTMLElement {
    constructor() {
        super();
        this.addEventListener('change', this._onVariantChange);
    }

    _onVariantChange() {
        this.drawerEl = this.closest('drawer-options');
        this._updateOptions();
        this._updateMasterId();
        this._updateVariantStatuses();
        if (!this.currentVariant) {
            this._toggleAddButton(true, '');
            this._setUnavailable();
        } else {
            this._updateVariantInput();
            this._renderProductInfo();
        }
    }

    // Get product options which are selected
    _updateOptions() {
        this.options = Array.from(
            this.querySelectorAll('select'),
            (select) => select.value
        );
    }
    // Get current variant base on options selected
    _updateMasterId() {
        const { product } = this.closest('drawer-options').productData;
        this.currentVariant = product.variants.find((variant) => {
            return !variant.options
                .map((option, index) => {
                    return this.options[index] === option;
                })
                .includes(false);
        });
        console.log(this.currentVariant);
    }

    // Toggle Button state based on
    // 1) Product Availability
    // a) Available
    // b) OutofStock
    // c) Variant Not available
    _toggleAddButton(disable = true, text) {
        const productForm = this.closest('form');
        if (!productForm) return;
        const addButton =
            this.closest('drawer-options').querySelector('[name="add"]');
        const addButtonText = addButton.querySelector('.btn--text');
        if (!addButton) return;

        if (disable) {
            // addButton.setAttribute('disabled', 'disabled');
            HELPER_UTIL.submitButtonState(addButton).disableState();
            if (text) addButtonText.textContent = text;
        } else {
            // addButton.removeAttribute('disabled');
            HELPER_UTIL.submitButtonState(addButton).disableState(false);
            addButtonText.textContent = window.variantStrings.addToCart;
        }
    }

    // if not variant data found based on product options selected in UI
    _setUnavailable() {
        const addButton = this.drawerEl.querySelector('[name="add"]');
        const addButtonText = addButton.querySelector('.btn--text');
        const priceWrapper = this.drawerEl.productPriceWrapper;
        if (!addButton) return;
        addButtonText.textContent = window.variantStrings.unavailable;
        if (priceWrapper) priceWrapper.classList.add('visibility-hidden');
    }

    // Get and set current Variant id to input[name=id]
    _updateVariantInput() {
        const productForm = this.closest('form');
        const input = productForm.querySelector('input[name="id"]');
        input.value = this.currentVariant.id;
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Render product info based on current variant option selected
    // 1) Price
    _renderProductInfo() {
        const priceWrapper = this.drawerEl.productPriceWrapper;
        this.drawerEl._updateProductPrice(this.currentVariant);
        if (priceWrapper) priceWrapper.classList.remove('visibility-hidden');
        if (!this.currentVariant.available) {
            this._toggleAddButton(
                !this.currentVariant.available,
                window.variantStrings.soldOut
            );
        } else {
            this._toggleAddButton(false);
        }
    }

    // check option combination if available or not update UI based on it.
    _updateVariantStatuses(variantsData) {
        const productVariants =
            variantsData ||
            this.closest('drawer-options').productData.product.variants;
        const selectedOptionOneVariants = productVariants.filter(
            (variant) =>
                this.querySelector(':checked').value === variant.option1
        );
        const inputWrappers = [
            ...this.querySelectorAll('[product-variant-option]'),
        ];
        inputWrappers.forEach((option, index) => {
            if (index === 0) return;
            const optionInputs = [
                ...option.querySelectorAll('input[type="radio"], option'),
            ];
            const previousOptionSelected =
                inputWrappers[index - 1].querySelector(':checked').value;
            const availableOptionInputsValue = selectedOptionOneVariants
                .filter(
                    (variant) =>
                        variant.available &&
                        variant[`option${index}`] === previousOptionSelected
                )
                .map((variantOption) => variantOption[`option${index + 1}`]);
            this._setInputAvailability(
                optionInputs,
                availableOptionInputsValue
            );
        });
    }

    // Set input Ui visiblitity based on options combinations
    _setInputAvailability(listOfOptions, listOfAvailableOptions) {
        listOfOptions.forEach((input) => {
            if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
                input.innerText = input.getAttribute('value');
            } else {
                input.innerText =
                    window.variantStrings.unavailable_with_option.replace(
                        '[value]',
                        input.getAttribute('value')
                    );
            }
        });
    }

    connectedCallback() {
        console.log('Variant Selector connected');
    }

    disconnectedCallback() {
        this.removeEventListener('change', this._onVariantChange);
        console.log('Varaint Selector Removed');
    }
}

customElements.get('drawer-variant-dropdown-selector') ||
    customElements.define(
        'drawer-variant-dropdown-selector',
        DrawerVaraintDropDownSelector
    );

class DrawerVaraintPillSelector extends DrawerVaraintDropDownSelector {
    constructor() {
        super();
    }

    _updateOptions() {
        const fieldsets = Array.from(this.querySelectorAll('fieldset'));
        this.options = fieldsets.map((fieldset) => {
            return Array.from(fieldset.querySelectorAll('input')).find(
                (radio) => radio.checked
            ).value;
        });
    }

    _setInputAvailability(listOfOptions, listOfAvailableOptions) {
        listOfOptions.forEach((input) => {
            if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
                input.classList.remove('disabled');
            } else {
                input.classList.add('disabled');
            }
        });
    }

    connectedCallback() {
        console.log('Variant Pills connected');
    }

    disconnectedCallback() {
        console.log('Varaint Pills Removed');
    }
}

customElements.get('drawer-variant-pills-selector') ||
    customElements.define(
        'drawer-variant-pills-selector',
        DrawerVaraintPillSelector
    );
