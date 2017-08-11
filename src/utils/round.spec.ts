import 'mocha';
import { expect } from 'chai';
import { round } from './round';

describe('utils/round', () => {
    describe('round', () => {
        it('should round on given length', () => {
            expect(round(12345.6789)).to.be.eql(12346);
            expect(round(12345.6789, 2)).to.be.eql(12345.68);
            expect(round(12345.6789, -2)).to.be.eql(12300);
        })
    });
});
