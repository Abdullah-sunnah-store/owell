class ShoppableFeedCard extends HTMLElement {
    constructor(){
        super();
        this.mediaPlayElement = this.querySelector('[media-interaction-element]');
    }

    initCommonEventListeners(){
        this.mediaPlayElement && this.mediaPlayElement.addEventListener("click", (e) => {
            console.log("User clicked on playable area");
        })
    }

    connectedCallback(){
        this.initCommonEventListeners();
    }

    disconnectedCallback(){

    }
}


customElements.get('shoppable-feed-card') || customElements.define('shoppable-feed-card', ShoppableFeedCard);