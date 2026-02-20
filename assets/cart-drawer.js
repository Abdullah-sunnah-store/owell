const drawerEvents = {
    OnLineItemUpdate: 'action:cart:updateLineItem',
    onQuantityChange: 'on:QuantityChange',
    triggerCartChange: 'action:cart:updateCart',
};

class DrawerCart extends HTMLElement {
    constructor() {
        super();
        this.currentLineItem;
        this.lineItemError = null;
        this.cartIdentifier = this.getAttribute('render-section');
        this.checkoutContainer = document.querySelector(
            '[cart-checkout-container]'
        );

        this.sectionId =
            this.getAttribute('data-sectionId') || this.cartIdentifier;

        this.addEventListener(
            _EVENT_HELPER.OnLineItemUpdate,
            this.handleLineItem.bind(this)
        );

        /* Listening for this event to update cart items and show cart drawer base on products Added to cart via product-form,product-card component 
            Usage: document.dispatchEvent(new CustomEvent(_EVENT_HELPER.triggerCartChange, { detail: {}}));
            Note: Make sure to pass the `detail` @object with the data consisting of sections that can fetched via section rendering Api functionality of Shopify
        */

        document.addEventListener(
            _EVENT_HELPER.triggerCartChange,
            this.renderCart.bind(this)
        );

        /* Listening for this event to update cart items and show cart drawer based on custom functionality of the theme 
            Scenarios: When user adds a product to cart, the cart drawer should be updated and shown
            Usage: document.dispatchEvent(new CustomEvent(_EVENT_HELPER.updateAndShowCart, { detail: {}}));
        */
        document.addEventListener(
            _EVENT_HELPER.updateAndShowCart,
            this.fetchAndRenderCartItems.bind(this)
        );
    }

    _getCartItemCount(data) {
        const cartSection = data.sections[this.cartIdentifier];
        const parseCartSectionHTML = new DOMParser().parseFromString(
            cartSection,
            'text/html'
        );

        return parseCartSectionHTML.querySelector(this.tagName).dataset
            .cartitemcount;
    }

    renderCart(e) {
        this.renderCartContents(e.detail);
        // Update dependent Elements to be render
        this.renderElementsBasedOnCartItems(e.detail);
        if (
            this.cartIdentifier == 'cart-drawer' &&
            !this.closest('cart-drawer-component').isDrawerOpen
        ) {
            HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.showDrawer, this, {
                drawerType: 'cart-drawer',
            });
        }
    }

    _get(property) {
        return this[property];
    }

    _set(property, value) {
        this[property] = value;
    }

    showDrawerToastMessage({ responseObj, messageType }) {
        HELPER_UTIL.dispatchCustomEvent(
            _EVENT_HELPER.triggerToastMessage,
            document,
            {
                toastType: 'common-errors',
                messageType: messageType,
                message: responseObj.message,
            }
        );
    }

    quantityElementAction({ line, quantity }) {
        const enable = () => {
            this.querySelectorAll('quantity-selector').forEach((el) =>
                el.setAttribute('is-disabled', 'false')
            );
        };

        const disable = () => {
            this.querySelectorAll('quantity-selector').forEach((el) =>
                el.setAttribute('is-disabled', 'true')
            );
        };

        const resetToPreviousValue = () => {
            this.querySelector(`[item-index="${line}"]`)
                .querySelectorAll('quantity-selector input')
                .forEach((el) => {
                    el.value = (Number(quantity) - 1).toString();
                });
        };

        return {
            enable,
            disable,
            resetToPreviousValue,
        };
    }

    updateCartTotal(data) {
        const cartTotal = data.total_price;
        const cartTotalEl = document.querySelectorAll('[cart-total]');
        [...cartTotalEl].forEach((el) => {
            el.textContent = Shopify.formatMoney(
                cartTotal,
                Shopify.money_format
            );
        });
    }

    cartCheckoutEl() {
        // const checkoutContainer = document.querySelector(
        //     '[cart-checkout-container]'
        // );
        const hideContainerClass = 'hide';
        const show = () => {
            if (this.checkoutContainer.classList.contains(hideContainerClass)) {
                this.checkoutContainer.classList.remove(hideContainerClass);
            }
        };
        const hide = () => {
            this.checkoutContainer.classList.add(hideContainerClass);
        };

        return {
            show,
            hide,
        };
    }

    renderElementsBasedOnCartItems(data) {
        const cartItemCount = this._getCartItemCount(data);
        this.dataset.cartitemcount = cartItemCount;
        if (cartItemCount > 0) {
            HELPER_UTIL.dispatchCustomEvent(
                _EVENT_HELPER.showCartRecommendations,
                this
            );
        } else {
            HELPER_UTIL.dispatchCustomEvent(
                _EVENT_HELPER.hideCartRecommendations,
                this
            );
        }
    }

    handleLineItem({ detail }) {
        // Make Api request to update cart drawer based on line item index
        /* Detail Object return data inform of @object as follows:
            {
            line: line Item index,
            quantity: Line item quantity
         } */
        const data = {
            id: detail.key,
            quantity: detail.quantity,
        };

        const sectionsToRender = HELPER_UTIL.sectionRenderUtil(
            this.cartIdentifier
        ).getSectionsString();
        // Add sections key and strings of section id to be rendered
        // data['sections'] = HELPER_UTIL.sectionRenderUtil(
        //     this.sectionToRenderObj
        // ).getSectionsString();

        // Disable quantity selector of which quantity was increased
        this.quantityElementAction(detail).disable();

        HELPER_UTIL.fetchData({
            method: 'POST',
            url: `${window.Shopify.routes.root}cart/change.js?sections=${sectionsToRender}`,
            data: JSON.stringify(data),
            config: {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
            onsuccess: (data) => {
                HELPER_UTIL.dispatchCustomEvent(
                    _EVENT_HELPER.triggerCartChange,
                    this,
                    { sections: data.sections }
                );
            },
            onerror: (error) => {
                if (error.json) {
                    error.json().then((errorObj) => {
                        if (errorObj.status === 422) {
                            HELPER_UTIL.dispatchCustomEvent(
                                _EVENT_HELPER.triggerlineItemError,
                                this,
                                {
                                    errorObj: {
                                        lineItem: detail.key,
                                        responseObj: errorObj,
                                        messageType: 'error',
                                    },
                                }
                            );
                        }
                    });
                } else {
                    this.showDrawerToastMessage({
                        responseObj: {
                            message: 'Something went wrong.Please try again',
                        },
                        messageType: 'error',
                    });
                }
            },
            defaultCb: () => {
                this.quantityElementAction(detail).enable();
            },
        });
    }

    getHTMLFromString(dataToParse, elementToGet) {
        return new DOMParser()
            .parseFromString(dataToParse, 'text/html')
            .querySelector(elementToGet);
    }

    renderCartContents({ sections }) {
        try {
            const getSectionsToLoop = HELPER_UTIL.sectionRenderUtil(
                this.cartIdentifier
            ).getSectionsObject();
            getSectionsToLoop.forEach((sectionsObjItem) => {
                // Here sections{@object} is the data from the AJax ca;l we made to cart
                // sectionsObjItem @{object} is the class property consisting list of sections and there ids

                if (!!sections[sectionsObjItem.sectionId]) {
                    [
                        ...document.querySelectorAll(
                            sectionsObjItem.queryElement
                        ),
                    ].forEach((section) => {
                        section.innerHTML = this.getHTMLFromString(
                            sections[sectionsObjItem.sectionId],
                            sectionsObjItem.queryElement
                        ).innerHTML;
                    });
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    fetchAndRenderCartItems() {
        // Get liquid section  to render
        const sectionsToRender = HELPER_UTIL.sectionRenderUtil(
            this.cartIdentifier
        ).getSectionsString();
        // Make Ajax call to update.js and render cart
        HELPER_UTIL.fetchData({
            method: 'GET',
            url: `${window.Shopify.routes.root}cart/update.js?sections=${sectionsToRender}`,
            onsuccess: (data) => {
                HELPER_UTIL.dispatchCustomEvent(
                    _EVENT_HELPER.triggerCartChange,
                    this,
                    { sections: data.sections }
                );
            },
            onerror: (error) => {
                console.log(error);
            },
        });
    }

    disconnectedCallback() {
        // Remove all the event listeners added inside constructor to prevent memory leaks
        this.removeEventListener(
            drawerEvents.OnLineItemUpdate,
            this.handleLineItem.bind(this)
        );
        this.removeEventListener(
            drawerEvents.onQuantityChange,
            this.handleLineItem.bind(this)
        );
        this.removeEventListener(
            drawerEvents.triggerCartChange,
            this.renderCart.bind(this)
        );
        this.removeEventListener(
            drawerEvents.updateAndShowCart,
            this.fetchAndRenderCartItems.bind(this)
        );
    }
}

customElements.get('drawer-cart') ||
    customElements.define('drawer-cart', DrawerCart);

class CartPage extends DrawerCart {
    constructor() {
        super();
    }

    renderElementsBasedOnCartItems(data) {
        const cartItemCount = this._getCartItemCount(data);
        if (cartItemCount > 0) {
            // this.updateCartTotal(data);
            if (this.checkoutContainer) {
                this.cartCheckoutEl().show();
            }
        } else {
            if (this.checkoutContainer) {
                this.cartCheckoutEl().hide();
            }
        }
    }

    showDrawerToastMessage({ responseObj, messageType }) {
        const toastEl = this.querySelector('toast-message');
        toastEl.toast({
            message: responseObj.message,
            messageType: messageType,
        });
    }
}

customElements.get('cart-page') || customElements.define('cart-page', CartPage);

class DrawerItem extends HTMLElement {
    constructor() {
        super();
        this.itemKey = this.getAttribute('item-key'); // Unique line item key of the product in cart
        this.removeItemElement = this.querySelectorAll('[remove-lineItem]');
        [...this.removeItemElement].forEach((el) => {
            el.addEventListener(
                'click',
                this.dispatchLineItemUpdate.bind(this)
            );

            el.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.dispatchLineItemUpdate();
                }
            });
        });
        this.addEventListener(
            _EVENT_HELPER.onQuantityChange,
            this.dispatchLineItemUpdate.bind(this)
        );

        document.addEventListener(
            _EVENT_HELPER.triggerlineItemError,
            this.showLineItemError.bind(this)
        );
    }

    dispatchLineItemUpdate(e) {
        const productQuantity = e?.detail.quantity;
        let detail = {
            key: this.itemKey,
            quantity: productQuantity ? productQuantity : '0',
        };
        HELPER_UTIL.dispatchCustomEvent(
            _EVENT_HELPER.OnLineItemUpdate,
            this,
            detail
        );
    }

    handleLineItemErrorUpdate(errorObj) {
        let customMessageComponent =
            this.querySelector('custom-message') ||
            this.nextElementSibling.querySelector('custom-message');
        console.log(errorObj);
        // Adding  a
        // setTimeout(() => {
        customMessageComponent.showCustomMessage({
            errorMessage: errorObj.responseObj.message,
            messageType: errorObj.messageType,
        });
        // }, 0);
    }

    resetQuantitySelector() {
        this.querySelector('quantity-selector input').value =
            this.getAttribute('item-quantity');
    }

    showLineItemError(event) {
        const { errorObj } = event.detail;
        if (errorObj && errorObj.lineItem === this.itemKey) {
            this.handleLineItemErrorUpdate(errorObj);
            this.resetQuantitySelector();
        }
    }

    disconnectedCallback() {
        // Remove all the event listeners added inside constructor to prevent memory leaks
        this.removeEventListener(
            _EVENT_HELPER.onQuantityChange,
            this.dispatchLineItemUpdate.bind(this)
        );

        [...this.removeItemElement].forEach((el) => {
            el.removeEventListener(
                'click',
                this.dispatchLineItemUpdate.bind(this)
            );
            el.removeEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.dispatchLineItemUpdate();
                }
            });
        });
    }
}

customElements.get('drawer-item') ||
    customElements.define('drawer-item', DrawerItem);



//More checkout button animation 

class AdditionalCheckoutButtonsAnimation extends HTMLElement {
    constructor() {
        super();
        this.toggleButton = this.querySelector("[toggle-payment-buttons]")
        this.toggleButton?.addEventListener("click", this.togglePaymentButtons.bind(this))
        this.buttonsWrapper = this.querySelector("[checkout-buttons-wrapper]")

    }

    togglePaymentButtons(e) {
        e.preventDefault()
        this.toggleButton.classList.toggle("show-payment-options")
        this.setAttribute("style", `--button-wrapper-height:${this.buttonsWrapper?.firstElementChild.offsetHeight}px`)
        this.buttonsWrapper?.classList.toggle("active")
    }

}

customElements.get('additional-checkout-buttons-animation') ||
    customElements.define("additional-checkout-buttons-animation", AdditionalCheckoutButtonsAnimation)