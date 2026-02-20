class ComplementaryProducts extends HTMLElement {
    constructor() {
        super();
        this.productId = this.getAttribute('recommendation-product-id');
        this.recommendationType = this.getAttribute('recommendation-type');
        this.recommendationSectionName = this.getAttribute(
            'recommendation-section'
        );
        this.recommendationLimit = this.getAttribute('recommendation-limit');
        // Check if productRecommendations are loaded and use it in condition to prevent re-render of product
        this.didProductRecommendationLoad = false;
        this.elObj = {
            recommendationEl: '[products-data]',
            recommendationTitle: '[title]',
        };
        // Listen for event when component is in view
        this.addEventListener('observe:elementInView', () => {
            if (this.didProductRecommendationLoad) return;
            this.fetchData();
        });
    }

    queryHTMLData(htmlString, elementToQuery) {
        const html = new DOMParser().parseFromString(htmlString, 'text/html');
        return html.querySelector(elementToQuery).innerHTML;
    }

    renderTitle() {
        const getSectionTitle =
            this.querySelector('template').content.firstElementChild.cloneNode(
                true
            );

        this.prepend(getSectionTitle);
    }

    showProductLayout() {
        this.classList.remove('recommendation-inactive');
    }

    generateProductLayouts(textData) {
        const returnedHTMLAfterQuery = this.queryHTMLData(
            textData,
            this.elObj.recommendationEl
        );
        if (returnedHTMLAfterQuery && returnedHTMLAfterQuery.trim()) {
            try {
                const elToAppendData = this.querySelector(
                    this.elObj.recommendationEl
                );
                elToAppendData.innerHTML = returnedHTMLAfterQuery;
                this.renderTitle();
                this.showProductLayout();
            } catch (error) {
                console.log(error);
            }
        }
    }

    fetchData() {
        this.didProductRecommendationLoad = true;
        HELPER_UTIL.fetchData({
            method: 'GET',
            responseType: 'text',
            url: `${window.Shopify.routes.root}recommendations/products?product_id=${this.productId}&limit=${this.recommendationLimit}&section_id=${this.recommendationSectionName}&intent=${this.recommendationType}`,
            onsuccess: (textData) => {
                this.generateProductLayouts(textData);
                // this.setProductsContainer().active();
            },
            onerror: (error) => {
                console.log(error);
            },
        });
    }

    connectedCallback() {
        console.log('Complementary products connected');
    }
}

customElements.get('complementary-product') ||
    customElements.define('complementary-product', ComplementaryProducts);
