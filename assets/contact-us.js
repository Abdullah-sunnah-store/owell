class MapComponent extends HTMLElement {
    constructor() {
        super();
        this.latitude = Number(this.getAttribute('lat'));
        this.langitude = Number(this.getAttribute('lng'));
        if (this.hasAttribute('shop-name'))
            this.shopName = this.getAttribute('shop-name');
    }
    async initMap() {
        let map;
        const { Map } = await google.maps.importLibrary('maps');
        try {
            map = new Map(document.getElementById('map'), {
                center: { lat: this.latitude, lng: this.langitude },
                zoom: 8,
                mapTypeControl: true,
            });
    
            var marker = new google.maps.Marker({
                position: { lat: this.latitude, lng: this.langitude },
                map: map,
                label: this.shopName,
            });

        }
        catch(error){
            throw new Error(error)
        }


      
    }
    connectedCallback() {
        this.initMap();
    }
}

customElements.get('map-component') ||
    customElements.define('map-component', MapComponent);
