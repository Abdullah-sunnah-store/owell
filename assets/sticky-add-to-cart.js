class StickyAddToCart extends HTMLElement {
    constructor() {
        super();


        this.layout_type = this.querySelector("sticky-add-to-cart-content").getAttribute("layout-type")


        this.drawerType = this.querySelector("[drawer-to-open]") ? this.querySelector("[drawer-to-open]").getAttribute("drawer-to-open") : "sticky-add-to-cart-drawer"


        this.variantList = this.querySelector("[sticky-add-to-cart-variants]");
        this.addToCartButton = this.querySelector("[add-to-cart-button]");

        document.addEventListener(_EVENT_HELPER.updateStickyAddToCartContent, this._updateStickyAddToCartContent.bind(this));
        document.addEventListener(_EVENT_HELPER.updateStickyAddToCartContentUnAvailable, this._updateStickyAddToCartContentUnAvailable.bind(this));



    }



    _updateStickyAddToCartContent(e) {
        let content_list = e.detail.sticky_content
        content_list.forEach(element => {

            let stickyElement = element.querySelector("sticky-add-to-cart-content")
            if (stickyElement.getAttribute("layout-type") === this.layout_type) {
                this.querySelector("[sticky-add-to-cart-content]").innerHTML = element.innerHTML
            }
        });

    }

    _updateStickyAddToCartContentUnAvailable(e) {
        this.variantList.textContent = e.detail.variantOptions.join(", ")
        this.togleAddToCartButton(false)
    }

    disconnectedCallback() {

        document.removeEventListener(_EVENT_HELPER.updateStickyAddToCartContent, this._updateStickyAddToCartContent.bind(this));
    }

    togleAddToCartButton(buttonEnabled) {
        if (this.addToCartButton) {
            if (buttonEnabled) {
                this.addToCartButton.removeAttribute("disabled")
            }
            else {
                if (!this.addToCartButton.classList.contains("sticky-icon-button")) {
                    this.addToCartButton.textContent = window.variantStrings.unavailable
                }
                this.addToCartButton.removeAttribute("form")
                this.addToCartButton.setAttribute("disabled", true);
            }
        }
    }


}
window.customElements.define('sticky-add-to-cart', StickyAddToCart);


class StickyAddToCartContent extends HTMLElement {
    constructor() {
        super();
        this.addToCartButton = this.querySelector("[add-to-cart-button]");
        this.buttonContainer = this.querySelector("[stikcy-add-to-cart-button-content]")
        this.addToCartButton?.addEventListener("click", (e) => {
            HELPER_UTIL.submitButtonState(this.addToCartButton).loadingState();
            HELPER_UTIL.dispatchCustomEvent('submit', document.getElementById(this.addToCartButton.getAttribute('form')))

        })
        this._product_container = document.querySelector('[product-container]');
        this._drawerScrollToSection = document.querySelector("drawer-component [scroll-to-section]")
        this._scrollToSectionButton = this.querySelector("[scroll-to-section]")
        this.breakpoint = window.matchMedia('(min-width:768px)');
        document.addEventListener(_EVENT_HELPER.resetStickyAddTocartButton, (e) => {
            HELPER_UTIL.submitButtonState(this.addToCartButton).resetState(
                1000
            );
            HELPER_UTIL.submitButtonState(this.addToCartButton).disableState(
                false
            );
        })
        document.addEventListener('scroll', this._scrollHandler.bind(this));
        window.addEventListener('resize', this.screenResize.bind(this));
        document.addEventListener(_EVENT_HELPER.triggerVariantAddToCartError, (e) => {
            this.componentState = this.closest("sticky-add-to-cart").getAttribute("aria-hidden")
            if (this.componentState === "false") {
                this._scrollToSection(e)
            }
        })
        this._scrollToSectionButton && this._scrollToSectionButton.addEventListener("click", this._scrollToSection.bind(this))
        this._drawerScrollToSection && this._drawerScrollToSection.addEventListener("click", this._scrollToSection.bind(this))
        this.scrollTosectionElement = this._scrollToSectionButton?.getAttribute("scroll-to-section") || this._drawerScrollToSection?.getAttribute("scroll-to-section")
    }
    connectedCallback() {
        this._product_containerOffsetTop = this._product_container.offsetTop;
        this._product_containerHeight = this._product_container.offsetHeight;
        this._totalScrollHeight = this._product_containerOffsetTop + this._product_containerHeight;
        this.screenResize();
    }

    _scrollToSection(e) {
        e.preventDefault()

        HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.hideDrawer, this, {
            drawerType: this.drawerType,
        });
        window.scrollTo({
            top: this.scrollTosectionElementOffset,
            behavior: 'smooth'
        })
    }
    screenResize() {
        if (this.breakpoint.matches === true) {
            this.scrollTosectionElementOffset = document.querySelector(`[${this.scrollTosectionElement}]`)?.offsetTop

        } else {
            this.scrollTosectionElementOffset = document.querySelector(`[${this.scrollTosectionElement}]`)?.offsetTop + this._product_container.children[0].offsetHeight
        }
    }
    _scrollHandler() {

        if (window.scrollY > this._totalScrollHeight) {
            this.closest("sticky-add-to-cart")?.classList.add("active")
        } else {
            this.closest("sticky-add-to-cart")?.classList.remove("active")
        }
    }

    disconnectedCallback() {
        document.removeEventListener('scroll', this._scrollHandler.bind(this));
        this._scrollToSectionButton && this._scrollToSectionButton.removeEventListener("click", this._scrollToSection.bind(this))
        this._drawerScrollToSection && this._drawerScrollToSection.removeEventListener("click", this._scrollToSection.bind(this))
    }
}

window.customElements.define('sticky-add-to-cart-content', StickyAddToCartContent);