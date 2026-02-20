class DeleteAdress extends HTMLElement {
    constructor() {
        super();
        this.confirmButton = this.querySelector("[popup-confirm]");
        this.confirmButton.addEventListener("click", this._confirmDeleteAddress.bind(this));
        this.deletButtons = this.querySelectorAll('[deleteAddress]');


        this.deletButtons &&
            this.deletButtons.forEach((button) => {
                button.addEventListener('click', (e) => {
                    this.targetUrl = e.target.getAttribute('target-url')
                    console.log(this.targetUrl)
                    HELPER_UTIL.dispatchCustomEvent(
                        _EVENT_HELPER.showPopup,
                        button,
                        {
                            popupType: "delete-address-popup",
                        }
                    );
                    window.currentActiveElement = button;
                });
            });
    }



    //Get called when clicked on confirm button
    _confirmDeleteAddress() {
        if (this.targetUrl) {
            Shopify.postLink(
                this.targetUrl,
                {
                    parameters: { _method: 'delete' },
                }
            );
        }
    }
}

customElements.get('delete-address') || customElements.define('delete-address', DeleteAdress)