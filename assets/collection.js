const CollectionUtil = (function (){

    const handleFilterButtonClick = function(){
        const filterDrawerActionBtn = document.querySelectorAll('[filter-drawer-open]');
        [...filterDrawerActionBtn].forEach( btn => {
            btn.addEventListener('click', () => {
                HELPER_UTIL.dispatchCustomEvent(_EVENT_HELPER.showDrawer, document, {
                    drawerType: 'filter',
                });
            })
        })
    }

    const initEvents = function(){
        handleFilterButtonClick();
    }

    return{
        initEvents,
    }

})();

document.addEventListener('DOMContentLoaded', () => {
    CollectionUtil.initEvents();
})
