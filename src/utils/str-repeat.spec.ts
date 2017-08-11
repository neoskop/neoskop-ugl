import 'mocha';
import { expect } from 'chai';
import { strRepeat } from './str-repeat';

describe('utils/str-repeat', () => {
    describe('strRepeat', () => {
        it('should return an empty string on repeat <= 0', () => {
            expect(strRepeat('foobar', 0)).to.be.eql('');
            expect(strRepeat('foobar', -10)).to.be.eql('');
        });
    
        it('should repeat the string correctly', () => {
            expect(strRepeat('a', 1)).to.be.eql('a');
            expect(strRepeat('a', 2)).to.be.eql('aa');
            expect(strRepeat('a', 3)).to.be.eql('aaa');
            expect(strRepeat('a', 7)).to.be.eql('aaaaaaa');
            expect(strRepeat('ab', 1)).to.be.eql('ab');
            expect(strRepeat('ab', 2)).to.be.eql('abab');
            expect(strRepeat('ab', 3)).to.be.eql('ababab');
            expect(strRepeat('ab', 7)).to.be.eql('ababababababab');
        });
    });
});
