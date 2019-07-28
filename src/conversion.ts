import camelCase from 'lodash.camelcase';
import MagicString from 'magic-string';

export function convertToTypeStyle(css: string) {
    const cssLine = /([a-z-]+)(\s*:\s*)(.*?)(\s*;)/gi;
    const magicCss = new MagicString(css);

    let match;
    while ((match = cssLine.exec(css))) {
        console.log(match);
        const [, attr, attrSpacing, value, valueSpacing] = match;
        const camelAttr = camelCase(attr);

        const attrPos = match.index;
        const valuePos = match.index + attr.length + attrSpacing.length;

        let newValue = convertValueToTypeStyle(value);

        magicCss.overwrite(attrPos, attrPos + attr.length, camelAttr);
        magicCss.overwrite(attrPos + attr.length, valuePos, ': ');
        magicCss.overwrite(valuePos, valuePos + value.length, newValue);
        magicCss.overwrite(
            valuePos + value.length,
            valuePos + value.length + valueSpacing.length,
            ',',
        );
    }

    return magicCss.toString();
}

const unitRegex = /^([\d.]+)(em|%|px|rad|rem|vh|vw|turn)$/;
const unitNameRemap = new Map([['%', 'percent'], ['vh', 'viewHeight'], ['vw', 'viewWidth']]);
const hexRegex = /^#[a-f0-9]{3,6}$/;
const colorFunctionRegex = /^(rgba?|hsla?)\((.*?)\)$/;

function convertValueToTypeStyle(value: string) {
    if (unitRegex.test(value)) {
        return value.replace(unitRegex, (_, n, unit) => {
            unit = unitNameRemap.get(unit) || unit;
            return `${unit}(${n})`;
        });
    }

    if (hexRegex.test(value)) {
        return `color(${JSON.stringify(value)}).toString()`;
    }

    if (colorFunctionRegex.test(value)) {
        return `${value}.toString()`;
    }

    return JSON.stringify(value);
}
