class Localization extends HTMLElement {
    constructor() {
        super();
        this.isDropDownOpen = false;
        this.button = this.querySelector('[localization-btn-label]');
        this.input = this.querySelector(
            'input[name="locale_code"], input[name="country_code"]'
        );
        this.panel = this.querySelector('[localization-dropdown-panel]');
        this.links = this.querySelectorAll('[localization-link]');
        this.button.addEventListener('click', this.handelDropDown.bind(this));
        document.addEventListener('click', (e) => {
            if (!e.target.closest(this.tagName)) {
                this.hideDropdown(true);
            }
        });
        if (this.links) {
            [...this.links].forEach((link) => {
                link.addEventListener('click', this.selectItem.bind(this));
            });
        }
    }

    selectItem(e) {
        e.preventDefault();
        const form = this.querySelector('form');
        this.input.value = e.currentTarget.dataset.value;
        if (form) form.submit();
    }
    handelDropDown(e) {
        this.hideDropdown();
        if (this.isDropDownOpen) {
            this.hidePanel();
            this.button.setAttribute('aria-expanded','false')
        } else {
            this.showPanel();
            this.button.setAttribute('aria-expanded','true')
        }
    }

    hidePanel(e) {
        this.classList.remove('dropdown-active');
        this.panel.setAttribute('hidden', true);
        this.isDropDownOpen = false;
    }

    showPanel() {
        this.classList.add('dropdown-active');
        this.panel.removeAttribute('hidden');
        this.isDropDownOpen = true;
    }

    hideDropdown(hideAll = false) {
        document.querySelectorAll(this.tagName).forEach((el) => {
            if (hideAll && el.isDropDownOpen) {
                el.hidePanel();
            } else if (el !== this && el.isDropDownOpen) {
                el.hidePanel();
            }
        });
    }
    connectedCallback() {
        console.log('localization connected');
    }
}
customElements.get('localization-component') ||
    customElements.define('localization-component', Localization);
