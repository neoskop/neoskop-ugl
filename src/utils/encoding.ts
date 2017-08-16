
export function encode(input : string) : string {
    let result = '';
    
    for(let i = 0, l = input.length; i < l; ++i) {
        const code : number = charPointAt(input, i)!;
        
        if(0x80 > code) {
            result += String.fromCharCode(code);
        } else if(0x800 > code) {
            result += String.fromCharCode(0b11000000 | (code >> 6));
            result += String.fromCharCode(0b10000000 | (0b00111111 & code))
        } else if(0x10000 > code) {
            result += String.fromCharCode(0b11100000 | (code >> 12));
            result += String.fromCharCode(0b10000000 | (0b00111111 & (code >> 6)));
            result += String.fromCharCode(0b10000000 | (0b00111111 & code))
        } else {
            result += String.fromCharCode(0b11110000 | (code >> 18));
            result += String.fromCharCode(0b10000000 | (0b00111111 & (code >> 12)));
            result += String.fromCharCode(0b10000000 | (0b00111111 & (code >> 6)));
            result += String.fromCharCode(0b10000000 | (0b00111111 & code));
            i++;
        }
    }
    
    return result;
}

export function decode(input : string) : string {
    let result = '';
    
    for(let i = 0, l = input.length; i < l; ++i) {
        const code : number = input.charCodeAt(i);
    
        if((0b11110000 & code) === 0b11110000) {
            const c1 = code & 0b00000111,
                c2 = input.charCodeAt(++i) & 0b00111111,
                c3 = input.charCodeAt(++i) & 0b00111111,
                c4 = input.charCodeAt(++i) & 0b00111111;
            result += fromCodePoint((c1 << 18) | (c2 << 12) | (c3 << 6) | c4);
        } else if((0b11100000 & code) === 0b11100000) {
            const c1 = code & 0b00001111,
                c2 = input.charCodeAt(++i) & 0b00111111,
                c3 = input.charCodeAt(++i) & 0b00111111;
            result += fromCodePoint((c1 << 12) | (c2 << 6) | c3);
        } else if((0b11000000 & code) === 0b11000000) {
            const c1 = code & 0b00011111,
                c2 = input.charCodeAt(++i) & 0b00111111;
            result += fromCodePoint((c1 << 6) | c2);
        } else {
            result += fromCodePoint(code);
        }
    }
    
    return result;
}

export function charPointAt(str : string, position : number) : number|undefined {
    if(str.codePointAt) {
        return str.codePointAt(position);
    }
    
    /**
     * @see https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/String/codePointAt
     */
    const size = str.length;
    
    if (position < 0 || position >= size) {
        return undefined;
    }
    let first = str.charCodeAt(position),
        second : number;
    if(first >= 0xD800 && first <= 0xDBFF && size > position + 1) {
        second = str.charCodeAt(position + 1);
        if (second >= 0xDC00 && second <= 0xDFFF) {
            return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
        }
    }
    return first;
}

export function fromCodePoint(...codePoints : number[]) : string {
    if(String.fromCodePoint) {
        return String.fromCodePoint(...codePoints);
    }
    
    /**
     * @see https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/String/fromCodePoint
     */
    const MAX_SIZE = 0x4000;
    const codeUnits = [];
    var highSurrogate;
    var lowSurrogate;
    var index = -1;
    if (!codePoints.length) {
        return '';
    }
    var result = '';
    while (++index < codePoints.length) {
        var codePoint = Number(codePoints[index]);
        if (!isFinite(codePoint) || codePoint < 0 || codePoint > 0x10FFFF || Math.floor(codePoint) != codePoint) {
            throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) {
            codeUnits.push(codePoint);
        } else {
            codePoint -= 0x10000;
            highSurrogate = (codePoint >> 10) + 0xD800;
            lowSurrogate = (codePoint % 0x400) + 0xDC00;
            codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == codePoints.length || codeUnits.length > MAX_SIZE) {
            result += String.fromCharCode.apply(null, codeUnits);
            codeUnits.length = 0;
        }
    }
    return result;
}
