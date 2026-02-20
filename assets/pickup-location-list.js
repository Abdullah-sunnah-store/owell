class PickUpLocationsList extends HTMLElement {
    constructor() {
        super();
        document.addEventListener(
            'action:pickuplocationsDrawer:update',
            (e) => {
                const pickUpHtmlStringData = e.detail.pickUpHTMLList;
                this.updatePickupLocationList(pickUpHtmlStringData);
            }
        );
    }
    updatePickupLocationList(htmlStringData) {
        const parseStringDataToHTML = new DOMParser().parseFromString(
            htmlStringData,
            'text/html'
        );
        const getLocationsList = parseStringDataToHTML.querySelector(
            '[pickup-locations-data]'
        );
        const wrapperEl = document.createElement('div');
        wrapperEl.append(getLocationsList);
        this.innerHTML = wrapperEl.innerHTML;

        HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.showDrawer, this, {
            drawerType: 'pick-up-availiablity',
        });
    }
}

customElements.get('pickup-locations-list') ||
    customElements.define('pickup-locations-list', PickUpLocationsList);
