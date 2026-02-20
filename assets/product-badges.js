class BadgeComponent extends HTMLElement {
    constructor() {
        super();
        this.buttons = this.querySelectorAll('[triger-drawer-button]');
        this.getPortalElementId = this.getAttribute('target-portal-element') || null;
        this.buttons.forEach((button) => {
            button.addEventListener('click', this.openDrawer.bind(this, button));
        });
    }

    openDrawer(button) {
        window.currentActiveElement = button
        const drawerContent = button.querySelector('[drawer-content]').innerHTML;
        HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.showDrawer, document, {
            drawerType: 'badge-drawer',
            content: drawerContent,
            portalDrawerTo: this.getPortalElementId,
            portalBackSectionId: this.id,
        });
    }

}

customElements.get('badge-component') || customElements.define('badge-component', BadgeComponent);

class BadgeContent extends HTMLElement {
    constructor() {
        super();
        this.contentWrapper = this.querySelector('[content-wrapper]');
        document.addEventListener(_EVENT_HELPER.showDrawer, this.showDrawer.bind(this));
        document.addEventListener(_EVENT_HELPER.hideDrawer, this.hideDrawer.bind(this));
    }

    showDrawer(event) {
        this.contentWrapper.innerHTML = event.detail.content;
    }

    hideDrawer() {
        this.contentWrapper.innerHTML = '';
    }
}

customElements.get('badge-content') || customElements.define('badge-content', BadgeContent);