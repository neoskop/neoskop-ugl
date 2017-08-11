import 'mocha';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { UGLAbstractWriter } from './abstract-writer';

describe('writer/abstract-writer', () => {
    describe('UGLAbstractWriter', () => {
        let spy : sinon.SinonSpy,
            writer : UGLAbstractWriter;
        beforeEach(() => {
            spy = sinon.spy();
            writer = new class extends UGLAbstractWriter {
                _write(str : string) {
                    spy(str);
                }
            }
        });
        
        afterEach(() => {
            spy.reset();
        });
        
        describe('#string', () => {
            it('should crop from right when to long', () => {
                writer.string('Foobar', 3);
                expect(spy.lastCall.args[0]).to.be.eql('Foo');
            });
            
            it('should pad to right when to short', () => {
                writer.string('Foobar', 10);
                expect(spy.lastCall.args[0]).to.be.eql('Foobar    ');
            });
        });
        
        describe('#int', () => {
            it('should crop from right when to long', () => {
                writer.int(1234, 3);
                expect(spy.lastCall.args[0]).to.be.eql('123');
            });
            
            it('should pad to left when to short', () => {
                writer.int(1234, 10);
                expect(spy.lastCall.args[0]).to.be.eql('0000001234');
            });
        });
        
        describe('#float', () => {
            it('should pad to left and right correctly', () => {
                writer.float(1234.56, 10, 3);
                expect(spy.lastCall.args[0]).to.be.eql('0001234560')
            })
        });
        
        describe('#date', () => {
            it('should should validate string input', () => {
                expect(() => {
                    writer.date('abcdefgh');
                }).to.throw('Date field required format YYYYMMDD, "abcdefgh" given.');
                expect(spy.callCount).to.be.eql(0);
            });
            
            it('should use correct string value', () => {
                writer.date('20170527');
                expect(spy.lastCall.args[0]).to.be.eql('20170527')
            });
            
            it('should format Date object', () => {
                writer.date(new Date(2015, 7, 13));
                expect(spy.lastCall.args[0]).to.be.eql('20150813')
            })
        });
    
    
        describe('#nl', () => {
            it('should write CR/LF', () => {
                writer.nl();
                expect(spy.lastCall.args[0]).to.be.eql('\r\n')
            });
        });
    })
})
