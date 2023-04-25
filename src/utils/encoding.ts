
export function encode(input : string) : string {
    let result = '';
    
    for(let i = 0, l = input.length; i < l; ++i) {
        const code : number = input.codePointAt(i)!;
        
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
            result += String.fromCodePoint((c1 << 18) | (c2 << 12) | (c3 << 6) | c4);
        } else if((0b11100000 & code) === 0b11100000) {
            const c1 = code & 0b00001111,
                c2 = input.charCodeAt(++i) & 0b00111111,
                c3 = input.charCodeAt(++i) & 0b00111111;
            result += String.fromCodePoint((c1 << 12) | (c2 << 6) | c3);
        } else if((0b11000000 & code) === 0b11000000) {
            const c1 = code & 0b00011111,
                c2 = input.charCodeAt(++i) & 0b00111111;
            result += String.fromCodePoint((c1 << 6) | c2);
        } else {
            result += String.fromCodePoint(code);
        }
    }
    
    return result;
}

