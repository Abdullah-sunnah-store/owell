const productQuickViewEvents = {
    triggerProductQuickViewChange: 'action:productQuickView:update',
};

class ProductQuickView extends HTMLElement {
    constructor() {
        super();
        this.elementToTargetInsideResponseData = '[product-quick-view]';
        document.addEventListener(
            productQuickViewEvents.triggerProductQuickViewChange,
            (e) => {
                this._renderProductQuickViewElement(e.detail);
            }
        );

        document.addEventListener(_EVENT_HELPER.hideDrawer, (e) => {
            if (e.detail.drawerType == 'options') {
                this._clearDrawerInnerBody();
            }
        });
    }

    _clearDrawerInnerBody() {
        try {
            setTimeout(() => {
                this.innerHTML = '';
            }, 400);
        } catch (err) {
            throw new Error(err);
        }
    }

    _updateQuickViewData(responseData, drawerHeadingName) {
        const pageData = new DOMParser().parseFromString(
            responseData,
            'text/html'
        );
        const getQuickViewSection = pageData.querySelector(
            this.elementToTargetInsideResponseData
        );
        if (!getQuickViewSection) throw { sectionError: 'Section not found' };
        const div = document.createElement('div');
        div.append(getQuickViewSection);
        div.querySelector('.drawer__head').innerHTML = drawerHeadingName;
        this.innerHTML = div.innerHTML;
    }

    _triggerCartDrawer() {
        HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.showDrawer, document, {
            drawerType: 'options',
        });
    }

    _initShopifyPaymentButtons() {
        if (!Shopify?.PaymentButton?.init) return;

        Shopify.PaymentButton.init();
    }

    _renderProductQuickViewElement(eventCustomDetails) {
        const { productHandle, swatchChangeVariantId, submitButton, drawerHeadingName } =
            eventCustomDetails;

        // Render button loading State
        HELPER_UTIL.submitButtonState(submitButton).loadingState();

        HELPER_UTIL.fetchData({
            method: 'GET',
            url: `${Shopify.routes.root}products/${productHandle}?variant=${swatchChangeVariantId}&view=product-quick-view`,
            responseType: 'text',
            onsuccess: (data) => {
                if (!data)
                    throw new Error(
                        'No product data found! Check if you sending right product handle'
                    );

                this._updateQuickViewData(data, drawerHeadingName);
                // Initialize Accelerated checkout Payments Buttons
                this._initShopifyPaymentButtons();

                // Render button complete State
                HELPER_UTIL.submitButtonState(submitButton).completeState();

                // Show Cart Drawer
                this._triggerCartDrawer();
            },
            onerror: (error) => {
                /* FIXME : Add error handling by showing error toast */
                console.log(error);
                HELPER_UTIL.dispatchCustomEvent(
                    _EVENT_HELPER.triggerToastMessage,
                    document,
                    {
                        toastType: 'common-errors',
                        messageType: 'error',
                        message: 'Something went went wrong! Please try again',
                    }
                );
            },
            defaultCb: () => {
                // Render default State of button
                setTimeout(() => {
                    HELPER_UTIL.submitButtonState(submitButton).resetState(
                        1000
                    );
                    HELPER_UTIL.submitButtonState(submitButton).disableState(
                        false
                    );
                }, 1000);
            },
        });
    }

    connectedCallback() { }
}

customElements.get('product-quick-view-component') ||
    customElements.define('product-quick-view-component', ProductQuickView);

class BuyButtonMutationObserver extends MutationObserverComponent {
    constructor() {
        super();
    }

    _updateDrawerHeight() {
        const headerContainerHeight = this.closest("drawer-component").querySelector("[drawer-header]")?.offsetHeight


        this.closest('drawer-component')?.style.setProperty(
            '--set-container-height',
            `${headerContainerHeight}px`
        );
    }

    _mutationCallback(mutations) {
        mutations.forEach(() => {
            this._updateDrawerHeight();
        });
    }
}

customElements.get('buy-button-mutation-observer') ||
    customElements.define(
        'buy-button-mutation-observer',
        BuyButtonMutationObserver
    );
