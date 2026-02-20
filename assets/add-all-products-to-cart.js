class AddAllProductToCart extends HTMLElement {

    constructor() {
        super();

        this.submitButton = this.querySelector('[add-to-cart]');
        this.cartDrawer = document.querySelector('drawer-cart');
        this.product_container = this.querySelector("[drawer-items-container]")
        this.drawerType = this.getAttribute("drawer-type")
        document.addEventListener(_EVENT_HELPER.showDrawer, (e) => {
            if (e.detail.drawerType !== this.drawerType) return;

            this.updateLayout(e)
        });
        document.addEventListener(_EVENT_HELPER.hideDrawer, this.clearLayout.bind(this));

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleAddAllToCartClick();
        });
    }

    updateLayout(e) {
        const { productHtml } = e.detail;
        if (!productHtml) return;
        const gridItems = productHtml.querySelectorAll('[grid-item]')
        gridItems.forEach(item => {
            this.product_container.innerHTML += item.innerHTML

        });
    }

    clearLayout(e) {
        setTimeout(() => {
            this.product_container.innerHTML = "";

        }, 600);
    }

    handleAddAllToCartClick() {
        this.forms = this.querySelectorAll('.product-card-item__form');

        let formdata = {
            items: []
        }
        this.forms.forEach((form) => {
            let formData = new FormData(form);

            const formDataObj = {};

            formData.forEach((value, key) => {
                formDataObj[key] = value;

            });
            formdata.items.push(formDataObj);
        });


        HELPER_UTIL.submitButtonState(this.submitButton).loadingState();

        HELPER_UTIL.fetchData({
            method: 'POST',
            config: {
                headers: {
                    Accept: 'application/javascript',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json'
                },
            },
            url: `${window.Shopify.routes.root}cart/add.js?sections=${HELPER_UTIL.sectionRenderUtil('cart-drawer').getSectionsString()}`,
            data: JSON.stringify(formdata),
            onsuccess: (data) => {
                if (this.cartDrawer) {
                    window.currentActiveElement = this.submitButton;
                    HELPER_UTIL.dispatchCustomEvent(
                        _EVENT_HELPER.triggerCartChange,
                        this.submitButton,
                        { sections: data.sections }
                    );
                    // Show button Complete state
                    HELPER_UTIL.submitButtonState(this.submitButton).completeState();
                    // HELPER_UTIL.dispatchCustomEvent(
                    //     _EVENT_HELPER.showDrawer,
                    //     document,
                    //     {
                    //         drawerType: 'cart-drawer',
                    //     }
                    // );
                } else {
                    window.location.href = `${Shopify.routes.root}cart`;
                }
            },
            onerror: (error) => {
                if (error.json) {
                    error.json().then((errorObj) => {
                        if (errorObj.status === 422) {
                            HELPER_UTIL.dispatchCustomEvent(
                                _EVENT_HELPER.triggerToastMessage,
                                document,
                                {
                                    toastType: 'common-errors',
                                    messageType: 'error',
                                    message: errorObj.description,
                                }
                            );
                        }
                    });
                } else {
                    HELPER_UTIL.dispatchCustomEvent(
                        _EVENT_HELPER.triggerToastMessage,
                        document,
                        {
                            toastType: 'common-errors',
                            messageType: 'error',
                            message:
                                'Something went went wrong! Please try again',
                        }
                    );
                }
            },
            defaultCb: () => {
                setTimeout(() => {
                    HELPER_UTIL.submitButtonState(this.submitButton).resetState(
                        1000
                    );
                    HELPER_UTIL.submitButtonState(this.submitButton).disableState(
                        false
                    );
                }, 1000);
            },
        });

    }
}


window.customElements.define('add-all-products-to-cart', AddAllProductToCart);

class hotspotComponent extends HTMLElement {
    constructor() {
        super();
        this._view_all_button = this.querySelector('[view-all-drawer-button]');
        this._product_items = this.querySelector('template');
        this._drawer_to_open = this._view_all_button && this._view_all_button.getAttribute('drawer-to-open');
        this._product_items_html = this._product_items && this._product_items.content.querySelector('[hidden-product-items]');
        this._view_all_button && this._view_all_button.addEventListener('click', (e) => {

            HELPER_UTIL.dispatchCustomEvent(
                _EVENT_HELPER.showDrawer,
                this,
                {
                    drawerType: this._drawer_to_open,
                    productHtml: this._product_items_html

                }
            );
        });

    }


}

window.customElements.define('hotspot-component', hotspotComponent);