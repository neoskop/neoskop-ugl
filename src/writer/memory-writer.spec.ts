import 'mocha';
import { expect } from 'chai';
import { UGLMemoryWriter } from './memory-writer';

describe('writer/memory-writer', () => {
    describe('UGLMemoryWriter', () => {
        let writer : UGLMemoryWriter;
        beforeEach(() => {
            writer = new UGLMemoryWriter()
        });
        
        it('should write into memory', () => {
            writer.string('Foobar', 10).int(42, 4).float(13.37, 8, 3).date(new Date(2017, 8, 17)).nl();
            
            const expected = "Foobar    00420001337020170917\r\n";
            expect(writer.toString()).to.be.eql(expected);
            expect(writer.toBuffer()).to.be.eql(new Buffer(expected));
        });
    })
})
