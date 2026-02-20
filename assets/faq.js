class TabItem extends HTMLElement {
    constructor() {
        super();
        this.totalItem = document.querySelectorAll('tab-item');
        this.link = this.querySelectorAll("[faqLink]")
        this.tabs_container = document.querySelectorAll('[tabs-container]');
        this.link.forEach((link) => {
            link.addEventListener('click', this.updateTabContent.bind(this));
        })
        window.addEventListener("scroll", this.activeAccordion.bind(this));
    }
    updateTabContent(e) {
        this.closest("details").removeAttribute("open")
        e.preventDefault()
        let url = e.target.href
        let ele = document.querySelector(url.slice(url.indexOf("#")))
        if (ele) {
            window.scrollTo({ top: ele.offsetTop - 140, behavior: 'smooth' });

        }
    }

    removeActiveClassTabItem() {
        this.totalItem.forEach((item) => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
            }
        });
    }

    activeAccordion() {
        this.tabs_container.forEach((tabContainer) => {
            if ((tabContainer.offsetTop - 120) < (window.pageYOffset + tabContainer.scrollHeight)) {
                this.removeActiveClassTabItem()
                document.querySelector(`a[href="#${tabContainer.id}"]`).parentElement.classList.add('active');
            }

        })
    }


    connectedCallback() {
        let scrollH = 0;
        this.tabs_container.forEach((ele, index) => {
            scrollH += ele.closest('section').scrollHeight
            console.log(ele.closest('section'))
            let url = this.totalItem[index].querySelector("[faqLink]").href
            ele.id = url.slice(url.indexOf("#") + 1)
        })
    }
}

customElements.get('tab-item') || customElements.define('tab-item', TabItem);

class FaqCategory extends TabItem {
    constructor() {
        super();
        this.select = this.querySelector('select')
        this.select.addEventListener("change", this.updateTabContent.bind(this))

    }

    updateTabContent(e) {
        this.activateTabContent(e.target.value - 1)
    }
}

customElements.get('faq-category') || customElements.define('faq-category', FaqCategory);
