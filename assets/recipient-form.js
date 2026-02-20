if (!customElements.get('recipient-form')) {
    customElements.define(
        'recipient-form',
        class RecipientForm extends HTMLElement {
            constructor() {
                super();
                this.recipientFieldsLiveRegion = this.querySelector(
                    `#Recipient-fields-live-region-${this.dataset.sectionId}`
                );
                this.checkboxInput = this.querySelector(
                    `#Recipient-checkbox-${this.dataset.sectionId}`
                );
                this.checkboxInput.disabled = false;
                this.hiddenControlField = this.querySelector(
                    `#Recipient-control-${this.dataset.sectionId}`
                );
                this.hiddenControlField.disabled = true;
                this.emailInput = this.querySelector(
                    `#Recipient-email-${this.dataset.sectionId}`
                );
                this.nameInput = this.querySelector(
                    `#Recipient-name-${this.dataset.sectionId}`
                );
                this.messageInput = this.querySelector(
                    `#Recipient-message-${this.dataset.sectionId}`
                );
                this.sendonInput = this.querySelector(
                    `#Recipient-send-on-${this.dataset.sectionId}`
                );
                this.offsetProperty = this.querySelector(
                    `#Recipient-timezone-offset-${this.dataset.sectionId}`
                );
                if (this.offsetProperty)
                    this.offsetProperty.value = new Date()
                        .getTimezoneOffset()
                        .toString();
                this.currentProductVariantId = this.dataset.productVariantId;
                this.addEventListener('change', this.onChange.bind(this));
                this.onChange();
            }

            connectedCallback() {
                /* 
                    Reset form when the current gift variant card is added to cart
                */
                document.addEventListener('action:cart:updateCart', (event) => {
                    if (
                        event.target.dataset.id === this.dataset.id &&
                        event.detail?.productVariant?.toString() ===
                            this.currentProductVariantId
                    ) {
                        this.resetRecipientForm();
                    }
                });

                // When varaint changes  update currentProductVariantId variable
                // Check when variant is not available
                document.addEventListener(
                    'action:update:VariantSelectorChangeBasedOnSelector',
                    (event) => {
                        if (event.target.dataset.id === this.dataset.id) {
                            this.currentProductVariantId =
                                event.detail.productVariant.toString();
                        }
                    }
                );

                // Display error when cart fires an error
                document.addEventListener(
                    'action:show:productGiftCartEror',
                    (event) => {
                        console.log(event.detail.errorObj);
                        if (event.target.dataset.id === this.dataset.id) {
                            this.displayErrorMessage(event.detail.errorObj);
                        }
                    }
                );
            }

            disconnectedCallback() {
                document.removeEventListener(
                    'action:show:productGiftCartEror',
                    (event) => {}
                );

                document.removeEventListener(
                    'action:update:VariantSelectorChangeBasedOnSelector',
                    (event) => {}
                );

                document.removeEventListener(
                    'action:cart:updateCart',
                    (event) => {}
                );
            }

            onChange() {
                if (this.checkboxInput.checked) {
                    this.enableInputFields();
                    this.recipientFieldsLiveRegion.innerText =
                        window.accessibilityStrings.recipientFormExpanded;
                } else {
                    this.clearInputFields();
                    this.disableInputFields();
                    this.clearErrorMessage();
                    this.recipientFieldsLiveRegion.innerText =
                        window.accessibilityStrings.recipientFormCollapsed;
                }
            }

            inputFields() {
                return [
                    this.emailInput,
                    this.nameInput,
                    this.messageInput,
                    this.sendonInput,
                ];
            }

            disableableFields() {
                return [...this.inputFields(), this.offsetProperty];
            }

            clearInputFields() {
                this.inputFields().forEach((field) => (field.value = ''));
            }

            enableInputFields() {
                this.disableableFields().forEach((field) => {
                    try {
                        field.disabled = false;
                    } catch (err) {
                        console.log(err);
                    }
                });
            }

            disableInputFields() {
                this.disableableFields().forEach((field) => {
                    try {
                        field.disabled = true;
                    } catch (err) {
                        console.log(err);
                    }
                });
            }

            displayErrorMessage(body) {
                this.clearErrorMessage();
                if (typeof body === 'object') {
                    return Object.entries(body).forEach(([key, value]) => {
                        const errorMessageId = `RecipientForm-${key}-error-${this.dataset.sectionId}`;
                        const fieldSelector = `#Recipient-${key}-${this.dataset.sectionId}`;
                        const errorMessageElement = this.querySelector(
                            `#${errorMessageId}`
                        );
                        const errorTextElement =
                            errorMessageElement?.querySelector(
                                '.error-message'
                            );
                        if (!errorTextElement) return;

                        errorTextElement.innerText = `${value}.`;
                        errorMessageElement.classList.add('d-flex');
                        errorMessageElement.classList.remove('d-none');

                        const inputElement = this[`${key}Input`];
                        if (!inputElement) return;

                        inputElement.setAttribute('aria-invalid', true);
                        inputElement.setAttribute(
                            'aria-describedby',
                            errorMessageId
                        );
                    });
                }
                // this.errorMessage.innerText = body;
            }

            createErrorListItem(target, message) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.setAttribute('href', target);
                a.innerText = message;
                li.appendChild(a);
                li.className = 'error-message';
                return li;
            }

            clearErrorMessage() {
                // this.errorMessageWrapper.hidden = true;

                // if (this.errorMessageList) this.errorMessageList.innerHTML = '';

                this.querySelectorAll(
                    '.recipient-fields .form__message'
                ).forEach((field) => {
                    field.classList.add('d-none');
                    const textField = field.querySelector('.error-message');
                    if (textField) textField.innerText = '';
                });

                [
                    this.emailInput,
                    this.messageInput,
                    this.nameInput,
                    this.sendonInput,
                ].forEach((inputElement) => {
                    inputElement.setAttribute('aria-invalid', false);
                    inputElement.removeAttribute('aria-describedby');
                });
            }

            resetRecipientForm() {
                if (this.checkboxInput.checked) {
                    this.checkboxInput.checked = false;
                    this.clearInputFields();
                    this.clearErrorMessage();
                }
            }
        }
    );
}
