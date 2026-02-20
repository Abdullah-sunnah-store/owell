//fiter popup

class FilterForm extends HTMLElement {
    constructor() {
        super();
    }

    static createSearchParams(form) {
        const formData = new FormData(form);
        return new URLSearchParams(formData).toString();
    }

    // static function to update exisiting search params
    static updateSearchParams(searchParams, key, value) {
        const searchParamsObj = new URLSearchParams(searchParams);
        searchParamsObj.set(key, value);
        return searchParamsObj.toString();
    }

    static setListeners() {
        const onHistoryChange = (event) => {
            const searchParams = event.state
                ? event.state.searchParams
                : FilterForm.searchParamsInitial;
            if (searchParams === FilterForm.searchParamsPrev) return;
            FilterForm.renderPage(searchParams, null, false);
        };
        window.addEventListener('popstate', onHistoryChange);
        document.addEventListener(
            _EVENT_HELPER.triggerFilterUpdate,
            (event) => {
                this.onSubmitHandler(event);
            }
        );
    }

    static getSections() {
        return [
            {
                section: document.getElementById('collection-grid').dataset.id,
            },
        ];
    }
    static renderSectionFromCache(filterDataUrl, event) {
        const html = FilterForm.filterData.find(filterDataUrl).html;
        FilterForm.renderProductGridContainer(html);
    }
    static renderPage(searchParams, event, updateURLHash = true) {
        FilterForm.searchParamsPrev = searchParams;
        const sections = FilterForm.getSections();
        sections.forEach((section) => {
            const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
            const filterDataUrl = (element) => element.url === url;
            FilterForm.filterData.some(filterDataUrl)
                ? FilterForm.renderSectionFromCache(filterDataUrl, event)
                : FilterForm.renderSectionFromFetch(url, event);
        });
        if (updateURLHash) FilterForm.updateURLHash(searchParams);
    }
    static renderProductGridContainer(html) {
        document.getElementById('collection-grid').innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('collection-grid').innerHTML;

    }

    static renderFilterDrawer(html) {
        const getFilterDrawer = document.querySelector(
            'filter-component.filter-drawer [filter-options]'
        );
        var html = new DOMParser().parseFromString(html, 'text/html');
        getFilterDrawer.innerHTML = html.querySelector(
            'filter-component.filter-drawer [filter-options]'
        ).innerHTML;
    }

    static renderSectionFromFetch(url) {
        const submitButton = document.querySelector('[apply-filter]');
        const collectionGridPreloader = document.querySelector("[data-collection-preloader]");
        collectionGridPreloader?.classList.add("collection-grid-preloader-styles");

        submitButton &&
            HELPER_UTIL.submitButtonState(submitButton).loadingState();
        HELPER_UTIL.fetchData({
            method: 'GET',
            url: url,
            responseType: 'text',
            onsuccess: (data) => {
                console.log('Success Data from Success CB');
                if (submitButton) {
                    HELPER_UTIL.submitButtonState(submitButton).completeState();
                    setTimeout(() => {
                        HELPER_UTIL.submitButtonState(
                            submitButton
                        ).resetState();
                        HELPER_UTIL.submitButtonState(
                            submitButton
                        ).disableState(false);
                        FilterForm.renderProductGridContainer(data);
                        FilterForm.renderFilterDrawer(data);
                    }, 400);
                    HELPER_UTIL.dispatchCustomEvent(
                        _EVENT_HELPER.hideDrawer,
                        document,
                        {
                            drawerType: 'filter',
                        }
                    );
                } else {
                    FilterForm.renderProductGridContainer(data);
                }
            },
            onerror: (error) => {
                console.log(error);
                console.log('Errors from error CB');
                HELPER_UTIL.dispatchCustomEvent(
                    _EVENT_HELPER.triggerToastMessage,
                    document,
                    {
                        toastType: 'common-errors',
                        messageType: 'error',
                        message: 'Something went went wrong! Please try again',
                    }
                );
            },
            defaultCb: () => {
                console.log('Run Default functions');
            },
        });
        let collectionGrid = document.getElementById("collection-grid").closest('section').offsetTop;
        window.scrollTo({ top: collectionGrid, behavior: "smooth" });
    }

    static onSubmitForm(searchParams, event) {
        FilterForm.renderPage(searchParams, event);
    }

    static onSubmitHandler(event) {

        // if event.details filyerForm id is equal to filter-drawer-form or filter-sidebar-form then consider filter-sortBy-form values also
        const formElId = event.detail.filterFormId;
        if (
            formElId === 'filter-drawer-form' ||
            formElId === 'filter-sidebar-form'
        ) {
            const sortByFilterForm = document.querySelector(
                '#filter-sortBy-form'
            );
            if (sortByFilterForm) {
                const sortByForm =
                    FilterForm.createSearchParams(sortByFilterForm);
                const filterForm = FilterForm.createSearchParams(
                    event.detail.filterForm
                );
                FilterForm.onSubmitForm(`${filterForm}&${sortByForm}`, event);
            } else {
                FilterForm.onSubmitForm(
                    FilterForm.createSearchParams(event.detail.filterForm),
                    event
                );
            }
        } else {
            // !!FIXME: Add a else if condition to check if the filterFormId is filter-sortBy-form
            const formEl = event.detail.filterForm;
            const formData = new FormData(formEl);
            const updatedSearchParam = FilterForm.updateSearchParams(
                FilterForm.searchParamsPrev,
                'sort_by',
                formData.get('sort_by')
            );
            FilterForm.onSubmitForm(updatedSearchParam, event);
        }
    }

    static updateURLHash(searchParams) {
        history.pushState(
            { searchParams },
            '',
            `${window.location.pathname}${searchParams && '?'.concat(searchParams)
            }`
        );
    }

    static onActiveFilterClick(event) {
        event.preventDefault();
        const url =
            event.currentTarget.href.indexOf('?') == -1
                ? ''
                : event.currentTarget.href.slice(
                    event.currentTarget.href.indexOf('?') + 1
                );
        FilterForm.renderPage(url);
        if (url != '') {
            FilterForm.activeSearchValue = url;
            FilterForm.urlSearchValue = new URLSearchParams(
                FilterForm.activeSearchValue
            );
            let activeItems = [];
            for (const searchItem of FilterForm.urlSearchValue) {
                let index = searchItem.toString().indexOf(',');
                let searchIndividual = searchItem.toString().slice(++index);
                activeItems.push(searchIndividual);
            }
            // !!FIXME: Check this #filter-form functionality
            document
                .querySelectorAll('#filter-form input[type="checkbox"]')
                .forEach((checkButton) => {
                    let flag = activeItems.some(
                        (ele) => ele == checkButton.value
                    );

                    if (flag == false) {
                        checkButton.removeAttribute('checked');
                    }
                });
        } else {
            // !!FIXME: Check this #filter-form functionality
            document
                .querySelectorAll('#filter-form input[type="checkbox"]')
                .forEach((checkButton) => {
                    if (checkButton.checked)
                        console.log('removing all the items');
                    checkButton.checked = false;
                });
        }
    }

    connectedCallback() {
        // FilterForm.setListeners();
    }
}
FilterForm.filterData = [];
FilterForm.searchParamsInitial = window.location.search.slice(1);
FilterForm.searchParamsPrev = window.location.search.slice(1);
FilterForm.activeSearchValue = null;
FilterForm.urlSearchValue = null;
// customElements.define('filter-form', FilterForm);
FilterForm.setListeners();

// price filter

class PriceFilter extends HTMLElement {
    constructor() {
        super();
        this.inputField = this.querySelectorAll('.field__input');


    }

    updateRangeSlider(e) {
        // Updates rangeslider when inputing values in input field
        if (e?.target.value > 0) {
            const slides = this.querySelectorAll('.range-slider input')
            slides[0].value = parseFloat(this.inputField[0].value);
            slides[1].value = parseFloat(this.inputField[1].value);
            this.onInput(this.querySelector('.range-slider'))

        }
    }
    onInput = (parent, e) => {
        const slides = parent.querySelectorAll('input');
        const min = parseFloat(slides[0].min);
        const max = parseFloat(slides[0].max);

        let slide1 = parseFloat(slides[0].value);
        let slide2 = parseFloat(slides[1].value);

        const percentageMin = (slide1 / (max - min)) * 100;
        const percentageMax = (slide2 / (max - min)) * 100;

        if (percentageMin > percentageMax) {
            parent.style.setProperty('--range-slider-value-low', percentageMax);
            parent.style.setProperty('--range-slider-value-high', percentageMin);
        } else {

            parent.style.setProperty('--range-slider-value-low', percentageMin);
            parent.style.setProperty('--range-slider-value-high', percentageMax);
        }

        if (slide1 > slide2) {
            const tmp = slide2;
            slide2 = slide1;
            slide1 = tmp;
        }

        this.inputField[0].value = slide1;
        this.inputField[1].value = slide2;

    };

    connectedCallback() {
        this.inputField?.forEach(input => input.removeAttribute("disabled"))

        const range = this
        this.querySelectorAll('input').forEach((input) => {
            if (input.type === 'range') {
                input.oninput = (e) => {
                    this.onInput(range, e);
                    this.inputField?.forEach(input => {
                        input.name = input.dataset.name

                    })
                };
                this.onInput(range);
            }

            if (input.type === 'number') {
                input.oninput = (e) => {
                    input.name = input.dataset.name
                    this.updateRangeSlider(e)
                }
            }

        })


    }
}

customElements.define('price-range', PriceFilter);

// filter pill remove

class FacetRemove extends HTMLElement {
    constructor() {
        super();
        const facetLink = this.querySelector('a');
        facetLink.setAttribute('role', 'button');
        facetLink.addEventListener('click', this.closeFilter.bind(this));

        facetLink.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.code.toUpperCase() === 'SPACE') this.closeFilter(event);
        });
    }

    closeFilter(event) {
        event.preventDefault();
        FilterForm.onActiveFilterClick(event);
    }
}

customElements.define('facet-remove', FacetRemove);

// Filter custom element
class FilterComponent extends HTMLElement {
    constructor() {
        super();
        this.form = this.querySelector('form');
        this.formId = this.form.id;
        this.handleInputChangeDebounced = HELPER_UTIL.debounce(
            this.fireFilterUpdateEvent.bind(this),
            600
        );
        switch (this.formId) {
            case 'filter-drawer-form':
                this.form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.fireFilterUpdateEvent();
                });
                break;
            case 'filter-sidebar-form':
            case 'filter-sortBy-form':
                this.form.addEventListener('input', (e) => {
                    if (e?.target.type === 'number') {
                        // No need call handleInputChangeDebounced function when user clears input
                        e?.target.value !== '' && this.handleInputChangeDebounced();

                    } else {
                        this.handleInputChangeDebounced();
                    }

                });
                break;
            default:
                break;
        }
    }

    fireFilterUpdateEvent() {
        HELPER_UTIL.dispatchCustomEvent(
            _EVENT_HELPER.triggerFilterUpdate,
            document,
            {
                filterForm: this.form,
                filterFormId: this.formId,
            }
        );
    }

    connectedCallback() {
        console.log('FilterComponent Embeded');
    }
}

customElements.get('filter-component') ||
    customElements.define('filter-component', FilterComponent);
