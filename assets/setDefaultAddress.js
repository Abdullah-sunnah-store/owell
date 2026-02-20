class DefaultAddress extends HTMLElement {
    constructor() {
        super()
        this.defaultButton = this.querySelector("[updateAddressButton]")
        // this.defaultButton.addEventListener("click", this._setDefaultAaddress.bind(this))
        this.form = this.querySelector('form')
        if (this.form) {
            this.form.addEventListener("submit", this._setDefaultAaddress.bind(this))

        }
    }

    _setDefaultAaddress(e) {
        e.preventDefault()
        this.defaultAddressInput = this.querySelector("[default-address-input]:checked")
        this.defaultAddressInput.getAttribute('target-url')
        this.form.setAttribute('action', this.defaultAddressInput.getAttribute('target-url'))
        this.form.submit()
    }
}

customElements.get("default-address") || customElements.define("default-address", DefaultAddress)