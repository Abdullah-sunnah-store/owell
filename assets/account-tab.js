class Tabs extends HTMLElement {
    constructor() {
        super();
        this.navButton = this.querySelector("[nav-button]")
        this.addEventListener("click", this.toggleSection.bind(this))
        this.sectionToggleContainer = document.querySelectorAll("[sectionToggleContainer]")
        this.accountNav = document.querySelectorAll("[account-nav]")
    }
    connectedCallback() {

    }

    toggleSection(e) {
        e.preventDefault()
        console.log(e.target.dataset.id)
        if (this.sectionToggleContainer) {
            //activate container
            [...this.sectionToggleContainer].forEach((section) => {
                section.style.display = 'none'
            })
            document.querySelector(`#${e.target.dataset.id}`).style.display = 'block'

            //activate nav tabs
            if (this.accountNav) {
                [...this.accountNav].forEach(nav => {
                    if (nav.querySelector('a').hasAttribute('data-id')) {
                        // alert(nav.querySelector('a').getAttribute('data-id'))
                        if (nav.querySelector('a').getAttribute('data-id') == e.target.dataset.id) {
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

customElements.get("tabs") || customElements.define("tabs", Tabs)
//# sourceMappingURL=account-tab.js.map