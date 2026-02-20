class GiftCard extends HTMLElement {
    constructor() {
        super()
        this.copyButton = document.querySelector('[copy-code]')
        this.copyButton.addEventListener("click", this._copyToClipboard.bind(this))
        this.qrCode = this.querySelector("[qr-code]")
        this.printButton = this.querySelector("[print-button]")
        this.printButton.addEventListener("click", this._printScreen.bind(this))
        this.string = {
            qrImageAlt: this.qrCode.getAttribute("qr-alt-text")
        }
    }
    connectedCallback() {
        this._generateQRCode()
    }

    _generateQRCode() {
        new QRCode(document.querySelector('[gift-card-qr-code]'), {
            text: document
                .querySelector('[gift-card-qr-code]')
                .getAttribute('qr-identifier'),
            width: 136,
            height: 136,
            imageAltText: this.string.qrImageAlt
        });
    }

    _printScreen() {
        window.print();
    }
    _copyToClipboard(e) {

        HELPER_UTIL.submitButtonState(this.copyButton).loadingState();
        if (navigator.clipboard.writeText(document.querySelector('[gift-card-code]').value)) {
            HELPER_UTIL.submitButtonState(this.copyButton).completeState();

        }
        setTimeout(() => {
            HELPER_UTIL.submitButtonState(this.copyButton).resetState();
            this.copyButton.removeAttribute("disabled")
        }, 1000);


    }
}

customElements.get('gift-card') || customElements.define("gift-card", GiftCard)