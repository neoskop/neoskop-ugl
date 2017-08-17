import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UGLMemoryWriter } from './memory-writer';

describe('writer/memory-writer', () => {
    describe('UGLMemoryWriter', () => {
        let writer : UGLMemoryWriter,
            Blob : sinon.SinonSpy;
        beforeEach(() => {
            writer = new UGLMemoryWriter();
            
            (global as any).Blob = Blob = sinon.spy();
        });
        
        it('should write into memory', () => {
            writer.string('Foobar', 10).int(42, 4).float(13.37, 8, 3).date(new Date(2017, 8, 17)).nl();
            
            const expected = "Foobar    00420001337020170917\r\n";
            expect(writer.toString()).to.be.eql(expected);
            expect(writer.toBuffer()).to.be.eql(new Buffer(expected));
            expect(writer.toUint8Array()).to.be.eql(strToUint8Array(expected));
            
            writer.toBlob();
            
            expect(Blob.callCount).to.be.equal(1);
            expect(Blob.lastCall.args[0]).to.be.eql([
                strToUint8Array('Foobar    '),
                strToUint8Array('0042'),
                strToUint8Array('00013370'),
                strToUint8Array('20170917'),
                strToUint8Array('\r\n')
            ])
        });
    })
});

function strToUint8Array(str : string) : Uint8Array {
    return new Uint8Array(str.split('').map(c => c.charCodeAt(0)));
}
