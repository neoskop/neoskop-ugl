import 'mocha';
import { expect } from 'chai';
import { uid } from './uid';

describe('utils/uid', () => {
    describe('uid', () => {
        it('should generate valid uids', () => {
            const orig = Math.random;
            try {
                let i = 0;
                Math.random = () => {
                    return [0, .25, .5, .75, .9999999999][i++];
                };
    
                expect(uid(5)).to.be.eql(0);
                expect(uid(5)).to.be.eql(25000);
                expect(uid(5)).to.be.eql(50000);
                expect(uid(5)).to.be.eql(75000);
                expect(uid(5)).to.be.eql(99999);
            } finally {
                Math.random = orig;
            }
        })
    });
});
