class Util {
    static debounce(func: any, wait: number = 0, immediate: boolean = false) {
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

    static getUUID() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (Number(c) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> Number(c) / 4).toString(16)
        );
    }
}

export default Util;