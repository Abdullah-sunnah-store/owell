
class ProductRecommendations extends HTMLElement {
    constructor() {
        super();
        this.recommendedUrl = this.getAttribute('recommendedUrl');
        this.sectionId = this.getAttribute('section-id');
        this.productId = this.getAttribute('product-id');
        this.limit = this.getAttribute('limit');
        this.initialContentLoad = true;
        this.url = `${this.recommendedUrl}?section_id=${this.sectionId}&product_id=${this.productId}&limit=${this.limit}`;

    }

    renderProducts(){
        try {
            fetch(`${this.url}`, {
            method: 'GET',
            }).then((response) => {
                    if (!response.ok){
                        throw response;
                    } 
                    return response.text();
            })
            .then((data) => {
                const html = document.createElement('div');
                html.innerHTML = data;
                const recommendations = html.querySelector(
                    'product-recommendations'
                );
                if (
                    recommendations &&
                    recommendations
                        .querySelector('[recommendation-loader]')
                        .innerHTML.trim().length
                ) {
                    this.innerHTML = recommendations.innerHTML;
                } else {
                    this.closest('section').remove();
                }
            })
            .catch((error) => {
                throw new Error(error);
            });
        } catch (error) {
            throw new Error(`HTTp error! Status : ${error}`);
        }
    }

    connectedCallback(){
        window.requestIdleCallback(this.renderProducts.bind(this), { timeout: 1000 });
    }
}

customElements.define('product-recommendations', ProductRecommendations);
