import 'mocha';
import { expect } from 'chai';
import { decode, encode } from './encoding';


const tests : [ string, number[] ][] = [
    [ 'a', [ 'a'.charCodeAt(0) ] ],
    [ 'ä', [ 0xc3, 0xa4 ] ],
    [ String.fromCodePoint(0x20ac), [ 0xe2, 0x82, 0xac ] ],
    [ String.fromCodePoint(0x1d11e), [ 0xf0, 0x9d, 0x84, 0x9e ]]
];

describe('utils/encoding', () => {
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
                expect(decode(String.fromCodePoint(...input))).to.be.equal(output);
            }
        })
    })
});
