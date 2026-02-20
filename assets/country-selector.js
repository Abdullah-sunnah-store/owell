class CountryProvice extends HTMLElement {
  constructor() {
    super();
    this.countrySelector = this.querySelector("[country-selector]")

  }
  bind(fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  };
  addListener = function (target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
  };
  setSelectorByValue = function (selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
      var option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  };
  countryProvinceSelector = function (country_domid, province_domid, options) {
    this.countryEl = document.getElementById(country_domid);
    this.provinceEl = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

    this.addListener(this.countryEl, 'change', this.bind(this.countryHandler, this));

    this.initCountry();
    this.initProvince();
  };


  initCountry() {
    var value = this.countryEl.getAttribute('data-default');
    this.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  }

  initProvince() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      this.setSelectorByValue(this.provinceEl, value);
    }
  }

  countryHandler(e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  }

  clearOptions(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }

  setOptions(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }

  connectedCallback() {
    const formId = this.countrySelector.dataset.formId;
    this.countryProvinceSelector(`AddressCountry_${formId}`, `AddressProvince_${formId}`, {
      hideElement: `AddressProvinceContainer_${formId}`
    });

  }
}
customElements.get("country-province") || customElements.define("country-province", CountryProvice)