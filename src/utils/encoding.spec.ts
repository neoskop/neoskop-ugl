import 'mocha';
import { expect } from 'chai';
import { codePointAt, decode, encode, fromCodePoint } from './encoding';


const tests : [ string, number[] ][] = [
    [ 'a', [ 'a'.charCodeAt(0) ] ],
    [ 'ä', [ 0xc3, 0xa4 ] ],
    [ String.fromCodePoint(0x20ac), [ 0xe2, 0x82, 0xac ] ],
    [ String.fromCodePoint(0x1d11e), [ 0xf0, 0x9d, 0x84, 0x9e ]]
];

describe('utils/encoding', () => {
    let oFromCodePoint : any, oCodePointAt : any;
    before(() => {
        oFromCodePoint = String.fromCodePoint;
        delete String.fromCodePoint;
        
        oCodePointAt = String.prototype.codePointAt;
        delete String.prototype.codePointAt;
    });
    
    after(() => {
        String.fromCodePoint = oFromCodePoint;
        String.prototype.codePointAt = oCodePointAt;
    });
    
    describe('encode', () => {
        it('should encode into 8bit ascii', () => {
            for(let [ input, output ] of tests) {
                expect(encode(input)).to.be.equal(String.fromCharCode(...output));
                expect(encode(input).length).to.be.equal(output.length);
            }
        });
    });
    
    describe('decode', () => {
        it('should decode from 8bit ascii', () => {
            for(let [ output, input ] of tests) {
                expect(decode(String.fromCharCode(...input))).to.be.equal(output);
            }
        })
    });
    
    describe('codePointAt', () => {
        it('should undefined on invalid input', () => {
            expect(codePointAt('', -1)).to.be.undefined;
            expect(codePointAt('a', 2)).to.be.undefined;
        })
    });
    
    describe('fromCodePoint', () => {
        it('should return empty string on no input', () => {
            expect(fromCodePoint()).to.be.equal('');
        });
        
        it('should throw on invalid code point', () => {
            expect(() => {
                fromCodePoint(Infinity);
            }).to.throw('Invalid code point: Infinity');
            expect(() => {
                fromCodePoint(-1);
            }).to.throw('Invalid code point: -1');
            expect(() => {
                fromCodePoint(0x110000);
            }).to.throw('Invalid code point: 1114112');
            expect(() => {
                fromCodePoint(1.1);
            }).to.throw('Invalid code point: 1.1');
        })
    });
});
