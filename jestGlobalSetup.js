module.exports = () => {
    Object.defineProperty(global, 'window', {
        value: {
        },
        writable: true
    });    
};