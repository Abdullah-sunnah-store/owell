class AccordionTab extends HTMLElement {
    constructor() {
        super();
        this.accordionTab = this.querySelector('[accordionTab]');
        this.accordionBody = this.querySelector('[accordionBody]');
        // this.isActive = Boolean(this.getAttribute("is-active"));
        this.accordionTab.addEventListener(
            'click',
            this.onAccordionTabClick.bind(this)
        );
    }

    inActiveAccordion() {
        this.accordionBody.classList.remove('active');
        this.accordionBody.style.maxHeight = null;
        this.setAttribute('aria-expanded', 'false');
    }

    activeAccordion() {
        this.accordionBody.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        this.accordionBody.style.maxHeight =
            this.accordionBody.scrollHeight + 'px';
    }

    onAccordionTabClick() {
        this.accordionTab.classList.toggle('active');
        if (this.accordionBody.classList.contains('active')) {
            this.inActiveAccordion();
        } else {
            this.activeAccordion();
        }
    }
}

customElements.get('accordion-tab') ||
    customElements.define('accordion-tab', AccordionTab);

class NavigationAccordion extends AccordionTab {
    constructor() {
        super();
        this.accordionBodyParent = this.closest('[accordionBody]');
    }

    activeAccordion() {
        super.activeAccordion();
        if (this.accordionBodyParent) {
            setTimeout(() => {
                this.accordionBodyParent.style.maxHeight =
                    this.accordionBodyParent.scrollHeight + 'px';
            }, 300);
        }
    }
}

class AccordionTab extends HTMLElement {
    constructor() {
        super();
        this.accordionTab = this.querySelector('[accordionTab]');
        this.accordionBody = this.querySelector('[accordionBody]');
        // this.isActive = Boolean(this.getAttribute("is-active"));
        this.accordionTab.addEventListener(
            'click',
            this.onAccordionTabClick.bind(this)
        );
    }

    inActiveAccordion() {
        this.accordionBody.classList.remove('active');
        this.accordionBody.style.maxHeight = null;
        this.setAttribute('aria-expanded', 'false');
    }

    activeAccordion() {
        this.accordionBody.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        this.accordionBody.style.maxHeight =
            this.accordionBody.scrollHeight + 'px';
    }

    onAccordionTabClick() {
        this.accordionTab.classList.toggle('active');
        if (this.accordionBody.classList.contains('active')) {
            this.inActiveAccordion();
        } else {
            this.activeAccordion();
        }
    }
}

customElements.get('accordion-tab') ||
    customElements.define('accordion-tab', AccordionTab);
//# sourceMappingURL=accordion.js.map
