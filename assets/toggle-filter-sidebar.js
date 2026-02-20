class ToggleFilterSidebar extends HTMLElement {
  constructor() {
    super();
  }
  showHideDrawer(){
    let collectionParentElement = document.querySelector("[show-filter-sidebar]");
    let collectionElementAttribute = collectionParentElement.getAttribute("show-filter-sidebar");

    if(collectionElementAttribute == "true"){
      collectionParentElement.setAttribute("show-filter-sidebar", "false");
    }
    else{
      collectionParentElement.setAttribute("show-filter-sidebar", "true");
    }
  }
  connectedCallback() {
    this.addEventListener("click", this.showHideDrawer.bind(this));
  }
  disconnectedCallback() {
    this.removeEventListener('click', this.showHideDrawer.bind(this));
  }
}

customElements.get("toggle-filter-sidebar") ||
  customElements.define("toggle-filter-sidebar", ToggleFilterSidebar);