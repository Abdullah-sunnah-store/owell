class RecentlyViewedProducts extends HTMLElement {
    constructor() {
        super();
        this.sectionId = this.getAttribute('section-id')
        this.recentlyViewedProductsList = new Set(JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]"))
        this.sectionContainer = this.querySelector('[recently-viewed-product-container]')
        this.limit = parseInt(this.getAttribute("limit"))
        this.excludedProduct = this.getAttribute('excluded-product-id')
        this.excludedProduct && this.recentlyViewedProductsList.delete(this.excludedProduct)

    }

    getSearchParames(list) {
        return (Array.from(list.values()).map(item => `id:${item}`)).slice(0, this.limit).join(" OR ")
    }
    connectedCallback() {
        this.recentlyViewedProductsList?.size > 0 && this.renderRecentlyViewedProducts()

    }

    renderRecentlyViewedProducts() {
        HELPER_UTIL.fetchData({
            method: 'GET',
            responseType: 'text',
            url: `${Shopify.routes.root}search?type=product&q=${this.getSearchParames(this.recentlyViewedProductsList)}&section_id=${this.sectionId}`,
            onsuccess: (textData) => {
                this.sectionContainer.innerHTML = new DOMParser()
                    .parseFromString(textData, 'text/html')
                    .querySelector("[recently-viewed-product-container]").innerHTML
            },
            onerror: (error) => {
                throw new Error(error)
            },
        });
    }
}

customElements.get("recently-viewed-products") || customElements.define("recently-viewed-products", RecentlyViewedProducts)