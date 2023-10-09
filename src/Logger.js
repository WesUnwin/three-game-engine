class Logger {
    static dumpObject(obj, options = { positions: false }) {
        console.log(Logger._dumpObjectRecursive(obj, [], true, '', options).join('\n'));
    }

    static _dumpObjectRecursive(obj, lines = [], isLast = true, prefix = '', options) {
        const localPrefix = isLast ? '└─' : '├─';

        const formatNumber = num => parseFloat(num.toFixed(1));

        const { x, y, z } = obj.position;
        const position = `(${formatNumber(x)}, ${formatNumber(y)}, ${formatNumber(z)})`;

        const line = `${prefix}${prefix ? localPrefix : ''}${obj.name || 'untitled'}   ${options.positions ? position : ''}    [${obj.type}]`
        lines.push(line);

        const newPrefix = prefix + (isLast ? '  ' : '│ ');
        const lastNdx = obj.children.length - 1;
        obj.children.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            Logger._dumpObjectRecursive(child, lines, isLast, newPrefix, options);
        });
        return lines;
    }
}

export default Logger;