class ScrollToTop extends HTMLElement{
    connectedCallback(){
        // Scroll back to top when clicked
        this.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

        // Check for button postion on load
        this.showButton();

        // Element shows up when scrolling
        document.addEventListener("scroll", () => {
            this.showButton();
        });
        // Checks for 'sticky-add-to-cart' in product page
        if(document.querySelector('sticky-add-to-cart')){
            if(this.classList.contains("pos-right")){
                this.classList.remove("pos-right");
                this.classList.add("pos-left");
            }
        }
    }

    showButton(){
        if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20){
            this.classList.add("active");
        }
        else{
            if(this.classList.contains('active')){
                this.classList.remove("active");
            }
        }
    }
}

customElements.get("scroll-to-top") || customElements.define("scroll-to-top", ScrollToTop);