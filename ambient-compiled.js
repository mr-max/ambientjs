'use strict';

(function () {
    var html = document.getElementsByTagName('html')[0],
        brightClass = 'ambient-bright',
        darkClass = 'ambient-dark',
        threshold = 50,
        lastValue = undefined,
        lastState = undefined,
        automatic = true,
        defaultState = true,
        debugElement = document.querySelector("#ambient-debug"),
        toggles = [].slice.call(document.querySelectorAll("input[data-ambient=ambient]"));

    function isBright() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? lastValue : arguments[0];

        return value >= threshold;
    }

    function setState(isBright) {
        var element = arguments.length <= 1 || arguments[1] === undefined ? html : arguments[1];

        if (isBright === lastState) {
            return;
        }

        lastState = isBright;
        element.classList.add(isBright ? brightClass : darkClass);
        element.classList.remove(isBright ? darkClass : brightClass);

        toggles.forEach(function (toggle) {
            toggle.checked = !isBright;
            toggle.dispatchEvent(new Event('change', { bubbles: true }));
        });

        debug();
    }

    function debug() {
        if (!debugElement) {
            return;
        }

        debugElement.innerHTML = '{ ambient light: <span>' + lastValue + ' lux</span>, mode: <span>' + (lastState ? 'day' : 'night') + '</span>, threshold: <span>' + threshold + ' lux</span>, automatic: <span>' + (automatic ? 'yes' : 'no') + '</span> }';
    }

    // Initialize the page to day/night mode
    setState(defaultState);

    // Listen for changes in ambient light
    window.addEventListener("devicelight", function (event) {
        lastValue = event.value;
        debug();

        if (automatic) {
            setState(isBright());
        }
    });

    // Listen for changes made by the user
    toggles.forEach(function (toggle) {
        toggle.addEventListener("change", function (event) {
            var isBright = !event.target.checked;

            if (lastState !== isBright) {
                automatic = false;
                setState(isBright);
            }
        });
    });
})();

//# sourceMappingURL=ambient-compiled.js.map