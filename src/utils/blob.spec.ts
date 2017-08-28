import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { BlobBuilder } from './blob';

describe('utils/blob', () => {
    describe('BlobBuilder', () => {
        let builder : BlobBuilder,
            content : Uint8Array[],
            Blob : sinon.SinonSpy;
        beforeEach(() => {
            builder = new BlobBuilder();
            content = builder['content'];
            
            (global as any).Blob = Blob = sinon.spy();
        });
        
        describe('#append', () => {
            describe('type string', () => {
                it('should write and encode', () => {
                    builder.append('a');
                    builder.append('ä');
    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0x61 ]),
                        new Uint8Array([ 0xc3, 0xa4 ])
                    ]);
                });
                
                it('should crop on given length', () => {
                    builder.append('äöü', 5);
                    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0xc3, 0xa4, 0xc3, 0xb6, 0xc3 ])
                    ]);
                })
            });
            
            describe('type number[]', () => {
                it('should write', () => {
                    builder.append([ 0x61 ]);
                    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0x61 ])
                    ]);
                });
    
                it('should crop on given length', () => {
                    builder.append([ 0x61, 0x62, 0x63, 0x64, 0x65], 3);
                    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0x61, 0x62, 0x63 ])
                    ]);
                });
            });
            
            describe('type Uint8Array', () => {
                it('should write', () => {
                    builder.append(new Uint8Array([ 0x61 ]));
                    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0x61 ])
                    ]);
                });
    
                it('should crop on given length', () => {
                    builder.append(new Uint8Array([ 0x61, 0x62, 0x63, 0x64, 0x65]), 3);
                    
                    expect(content).to.be.eql([
                        new Uint8Array([ 0x61, 0x62, 0x63 ])
                    ]);
                });
            })
        })
        
        describe('#toUint8Array', () => {
            it('should return one concated Uint8Array', () => {
                builder.append([ 0x61 ]);
                builder.append([ 0x62 ]);
                builder.append([ 0x63 ]);
                builder.append([ 0x64 ]);
                
                const arr = builder.toUint8Array();
                
                expect(arr).to.be.eql(new Uint8Array([ 0x61, 0x62, 0x63, 0x64 ]));
            });
        });
        
        describe('#toBuffer', () => {
            it('should return one concated Buffer', () => {
                builder.append([ 0x61 ]);
                builder.append([ 0x62 ]);
                builder.append([ 0x63 ]);
                builder.append([ 0x64 ]);
                
                const buf = builder.toBuffer();
    
    
                expect(buf).to.be.eql(new Buffer([ 0x61, 0x62, 0x63, 0x64 ]));
            });
        });
        
        describe('#toBlob', () => {
            it('should return one concated Blob', () => {
                builder.append([ 0x61 ]);
                builder.append([ 0x62 ]);
                builder.append([ 0x63 ]);
                builder.append([ 0x64 ]);
                
                builder.toBlob();
                
                expect(Blob.callCount).to.be.equal(1);
                expect(Blob.lastCall.args).to.have.length(1);
                expect(Blob.lastCall.args[0]).to.be.eql([
                    new Uint8Array([ 0x61 ]),
                    new Uint8Array([ 0x62 ]),
                    new Uint8Array([ 0x63 ]),
                    new Uint8Array([ 0x64 ])
                ])
            });
        });
    })
});
