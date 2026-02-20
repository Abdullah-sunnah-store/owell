const formDrawerEvents = {
    showSection:'action:showSection'
}

class ToggleAddressForms extends HTMLElement {
    constructor() {
        super()
        document.addEventListener(formDrawerEvents.showSection, this.toggleSection.bind(this))
        this.addAdress = document.querySelector("#add_address")
        this.editAddress = document.querySelector("#edit_address")
    }
    toggleSection(e) {
        let id = e.detail.detail.id
    
        if(id == 'new-address'){
            this.addAdress.classList.add("active")
            this.editAddress.classList.remove("active")
        }else {
            this.addAdress.classList.remove("active")
            this.editAddress.classList.add("active")

        }
        this.handelElementsVisibility(id);
    }

    handelElementsVisibility(targetElementId){
        let toggleFormElement = this.querySelectorAll('[address-toggle-form]');
        let targetElement = this.querySelector(
            `#addressForm-${targetElementId}`
        );
        toggleFormElement.forEach((formContainer) => {
            formContainer.classList.remove('active');
            formContainer.ariaHidden = true;
        });
        targetElement.classList.add('active');
        targetElement.ariaHidden = false;
    }
}

customElements.get("toggle-address-form") || customElements.define("toggle-address-form", ToggleAddressForms)