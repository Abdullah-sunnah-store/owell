class SearchForm extends HTMLElement {
    constructor(){
        super()
        this.searchInput = this.querySelector("[type='search']")
        this.inputClearButton = this.querySelector('[input-clear-button]');
         this.inputClearButton.addEventListener(
          'click',
          this.inputClear.bind(this)
      );
    }
    connectedCallback(){
        console.log("embed search form")
    }
    inputClear(){
        this.searchInput.value=''
    }


}

customElements.get("search-form") || customElements.define("search-form",SearchForm)