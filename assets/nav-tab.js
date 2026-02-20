class NavTabs extends HTMLElement {
    constructor() {
        super();
        this.sectionToggleContainer = this.querySelectorAll("[sectionToggleContainer]")
        this.accountNav = this.querySelectorAll("[account-nav]")


    }

    connectedCallback() {
        if (window.location.hash) {
            //    activate nav tabs
            if (this.accountNav) {
                [...this.accountNav].forEach(nav => {
                    if (nav.querySelector('a').hasAttribute('data-target')) {
                        if (nav.querySelector('a').getAttribute('data-target') == window.location.hash.slice(1)) {
                            nav.classList.add('active')
                        } else {
                            if (nav.classList.contains('active')) {
                                nav.classList.remove('active')

                            }
                        }
                    }
                })
            }
        }
    }

}

customElements.get("nav-tabs") || customElements.define("nav-tabs", NavTabs)
