export namespace UGLEncoding {
    export function utf8ToAscii(input: string): string {
        let result = '';

        for (let i = 0, l = input.length; i < l; ++i) {
            const code: number = input.codePointAt(i)!;

            if (0x80 > code) {
                result += String.fromCharCode(code);
            } else if (0x800 > code) {
                result += String.fromCharCode(0b11000000 | (code >> 6));
                result += String.fromCharCode(0b10000000 | (0b00111111 & code));
            } else if (0x10000 > code) {
                result += String.fromCharCode(0b11100000 | (code >> 12));
                result += String.fromCharCode(0b10000000 | (0b00111111 & (code >> 6)));
                result += String.fromCharCode(0b10000000 | (0b00111111 & code));
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

    export function string(str: string, length: number): string {
        return utf8ToAscii(str).padEnd(length, ' ').substring(0, length);
    }

    export function int(number: number, length: number): string {
        return Math.round(number).toString().padStart(length, '0').substring(0, length);
    }

    export function float(number: number, length: number, decimalLength: number): string {
        const factor = 10 ** decimalLength;
        const int = number | 0;
        const decimal = Math.round((number - int) * factor) / factor;

        return (
            int
                .toString()
                .padStart(length - decimalLength, '0')
                .substring(0, length - decimalLength) +
            decimal.toString().substring(2).padEnd(decimalLength, '0').substring(0, decimalLength)
        );
    }

    export function date(value: string | Date): string {
        if (typeof value === 'string') {
            if (!/^\d{8}$/.test(value)) {
                throw new Error(`Date field required format YYYYMMDD, "${value}" given.`);
            }
        } else {
            value =
                value.getFullYear().toString() +
                (value.getMonth() + 1).toString().padStart(2, '0') +
                value.getDate().toString().padStart(2, '0');
        }

        return value;
    }

    export const NL = '\r\n';

    export class Builder {
        private buffer: string[] = [];

        string(str: string, length: number): this {
            this.buffer.push(string(str, length));

            return this;
        }

        int(number: number, length: number): this {
            this.buffer.push(int(number, length));

            return this;
        }

        float(number: number, length: number, decimalLength: number): this {
            this.buffer.push(float(number, length, decimalLength));

            return this;
        }

        date(value: string | Date): this {
            this.buffer.push(date(value));

            return this;
        }

        build() {
            return this.buffer.join('').padEnd(200, ' ') + NL;
        }
    }
}
