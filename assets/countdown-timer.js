class CountdownTimer extends HTMLElement {
    constructor() {
        super();
        let options = {
            root: document,
            rootMargin: '0px',
            threshold: 0.01,
        };

        HELPER_UTIL.trigerElementFunctionalityInView(this, options);
        this.addEventListener(
            _EVENT_HELPER.elementIsInCurrentView,
            () => {
                this.calculateTimerData();
            })
    }

    calculateTimerData() {
        this.removeEventListener(_EVENT_HELPER.elementIsInCurrentView, () => {
            this.calculateTimerData()
        });
        let endYear = Number(this.getAttribute("data-year"));
        let endMonth = Number(this.getAttribute("data-month"));
        let endDay = Number(this.getAttribute("data-day"));
        let endHours = Number(this.getAttribute("data-hours"));
        let endMinute = Number(this.getAttribute("data-minute"));
        let time_zone_type = this.getAttribute("data-time-zone");
        let sectionId = this.getAttribute("data-section-id");
        let hide_on_completion = this.getAttribute("data-hide-on-completion");

        if (time_zone_type == "shop_time_zone") {
            let timezone = this.getAttribute("data-timezone");
            let shopTimeZone = new Date(this.getAttribute("data-shop-time-zone")).getTime();
            let endingTimer = new Date(`${endYear}/${endMonth}/${endDay} ${endHours}:${endMinute}:00${timezone}`);

            let timerCheckInterval = setInterval(() => {
                let timeDiff = endingTimer.getTime() - shopTimeZone;
                let distance = timeDiff - (new Date().getTime() - shopTimeZone);

                let { days, hours, minutes, seconds } = this.calculateAndAppendTime(distance);

                this.setCountdownTimerData(false, days, hours, minutes, seconds);
                if (distance < 0) {
                    clearInterval(timerCheckInterval);
                    this.setCountdownTimerData(true);
                    if (hide_on_completion == 'hide_on_completion') {
                        document.querySelector("#" + sectionId).style.display = "none"
                    }
                }
            }, 1000);
        }
        else {
            let endingTimer = new Date(`${endYear}/${endMonth}/${endDay} ${endHours}:${endMinute}:00`);

            let timerCheck = setInterval(() => {
                let now = new Date().getTime();
                let distance = (endingTimer.getTime()) - now;

                let { days, hours, minutes, seconds } = this.calculateAndAppendTime(distance);

                this.setCountdownTimerData(false, days, hours, minutes, seconds);
                if (distance < 0) {
                    clearInterval(timerCheck);
                    this.setCountdownTimerData(true);
                    if (hide_on_completion == 'hide_on_completion') {
                        document.querySelector("#" + sectionId).style.display = "none"
                    }
                }
            }, 1000)
        }
    }

    calculateAndAppendTime(distance) {
        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return { days, hours, seconds, minutes }
    }

    setCountdownTimerData(setToZero, days = "00", hrs = "00", mins = "00", secs = "00") {
        let days_ele = this.querySelector("[data-counter-days]");
        let hrs_ele = this.querySelector("[data-counter-hours]");
        let mins_ele = this.querySelector("[data-counter-mins]");
        let secs_ele = this.querySelector("[data-counter-seconds]");
        if (setToZero == true) {
            days_ele.innerHTML = "00";
            hrs_ele.innerHTML = "00";
            mins_ele.innerHTML = "00";
            secs_ele.innerHTML = "00";
        }
        else {
            if (days >= 0 && days <= 9) {
                days = "0" + days;
                days_ele.innerHTML = days;
            }
            else {
                days_ele.innerHTML = days;
            }

            if (hrs >= 0 && hrs <= 9) {
                hrs = "0" + hrs;
                hrs_ele.innerHTML = hrs;
            }
            else {
                hrs_ele.innerHTML = hrs;
            }

            if (mins >= 0 && mins <= 9) {
                mins = "0" + mins;
                mins_ele.innerHTML = mins;
            } else {
                mins_ele.innerHTML = mins;
            }

            if (secs >= 0 && secs <= 9) {
                secs = "0" + secs;
                secs_ele.innerHTML = secs;
            } else {
                secs_ele.innerHTML = secs;
            }
        }
    }
}

customElements.define("countdown-timer", CountdownTimer);