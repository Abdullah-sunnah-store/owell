class CustomDropdown extends HTMLElement {
    constructor() {
        super();
        this.flag = false
        this.dropdown_title = this.querySelector('[dropdown-title]')
        this.dropdown_list = this.querySelector('[dropdown-list]')
        this.button = this.querySelector('button')
        this.addEventListener("click", this.dropdownToggle.bind(this))
        window.addEventListener("scroll", this.hideDropdown.bind(this))
        this.button && this.button.addEventListener("focusout", this.hideDropdown.bind(this))

        if (this.hasAttribute("drop-type")) {
            if (this.getAttribute("drop-type") == 'select') {
                this.dropdown_list_item = this.querySelectorAll('[dropdown-list] a')
                this.dropdown_list_item.forEach((link) => {
                    link.addEventListener("click", this.itemSelect.bind(this))

                })
            }
        }
    }

    itemSelect(e) {
        this.dropdown_title.textContent = e.target.textContent
    }


    hideDropdown() {
        this.flag = false
        this.classList.remove("active")
        this.setAttribute("aria-selected", this.flag)


    }
    dropdownToggle() {
        this.flag = !this.flag
        this.classList.toggle("active")
        if (this.classList.contains("active")) {
            this.button.focus()

        }
        this.setAttribute("aria-selected", this.flag)
    }

}
customElements.get('custom-dropdown') || customElements.define('custom-dropdown', CustomDropdown);
