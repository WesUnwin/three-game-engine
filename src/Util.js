class Util {
    static debounce(func, wait, immediate) {
        let timeout;

        return function executedFunction() {
            const context = this;
            const args = arguments;
                
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            const callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    static isElectron() {
        return window.navigator.userAgent.includes('Electron/');
    }

    // eg. getRandomNumber(3) will return 0, 1, or 2
    static getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
}

export default Util;