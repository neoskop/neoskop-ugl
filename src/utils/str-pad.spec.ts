import 'mocha';
import { expect } from 'chai';
import { strPadLeft, strPadRight } from './str-pad';

describe('utils/str-pad', () => {
    describe('strPadLeft', () => {
        it('should return original string if longer than length', () => {
            expect(strPadLeft('Foobar', 4)).to.be.eql('Foobar');
        });
        
        it('should pad with default " "', () => {
            expect(strPadLeft('Foobar', 10)).to.be.eql('    Foobar');
        });
        
        it('should pad with provided string', () => {
            expect(strPadLeft('Foo', 10, 'x')).to.be.eql('xxxxxxxFoo');
            expect(strPadLeft('Foo', 10, 'xy')).to.be.eql('xyxyxyxFoo');
        });
    });
    
    describe('strPadRight', () => {
        it('should return original string if longer than length', () => {
            expect(strPadRight('Foobar', 4)).to.be.eql('Foobar');
        });
        
        it('should pad with default " "', () => {
            expect(strPadRight('Foobar', 10)).to.be.eql('Foobar    ');
        });
        
        it('should pad with provided string', () => {
            expect(strPadRight('Foo', 10, 'x')).to.be.eql('Fooxxxxxxx');
            expect(strPadRight('Foo', 10, 'xy')).to.be.eql('Fooxyxyxyx');
        });
    });
});
