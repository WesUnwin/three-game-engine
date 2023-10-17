import Scene from './Scene';
import GameObject from './GameObject';

class Logger {
    static printHierarchy(gameObjectOrScene, options = {}) {
        console.log(Logger.printHierarchyRecursive(gameObjectOrScene, [], true, '', options).join('\n'));
    }

    static printHierarchyRecursive(gameObjectOrScene, lines = [], isLast = true, prefix = '', options) {
        const obj = gameObjectOrScene;

        const localPrefix = isLast ? '└─' : '├─';

        let type = 'unknown';
        if (obj instanceof Scene) {
            type = 'Scene';
        } else if (obj instanceof GameObject) {
            type = 'GameObject';
        }

        const line = `${prefix}${prefix ? localPrefix : ''}${obj.name || 'un-named'}   [${type}]`
        lines.push(line);

        const newPrefix = prefix + (isLast ? '  ' : '│ ');
        const lastNdx = obj.gameObjects.length - 1;
        obj.gameObjects.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            Logger._dumpObjectRecursive(child, lines, isLast, newPrefix, options);
        });
        return lines;
    }

    static printThreeJSGraph(obj, options = { positions: false }) {
        console.log(Logger._printThreeJSGraphRecursive(obj, [], true, '', options).join('\n'));
    }

    static _printThreeJSGraphRecursive(obj, lines = [], isLast = true, prefix = '', options) {
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