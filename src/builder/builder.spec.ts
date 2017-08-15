import 'mocha';
import { expect } from 'chai';
import { UGLBuilder } from './builder';
import { UGLMemoryWriter } from '../writer/memory-writer';
import { RequestType } from '../types/request-type';
import { Mode } from '../types/mode';
import { PositionType } from '../types/position-type';
import { StoreType } from '../types/store-type';

describe('builder/builder', () => {
    describe('UGLBuilder', () => {
        let builder : UGLBuilder<UGLMemoryWriter>,
            writer : UGLMemoryWriter;
        beforeEach(() => {
            writer = new UGLMemoryWriter();
            builder = new UGLBuilder(writer);
        });
        
        describe('#kop', () => {
            it('should write kop with minimal data', () => {
                builder.kop({ requestType: RequestType.AB });
                
                expect(builder.getWriter().toString()).to.match(/^KOP0{10}0{10}AB\d{15} {50}0{15}0{8}EUR04.00 {40}\d{8}\r\n$/m);
            });
            
            it('should write kop with maximal data', () => {
                builder.kop({
                    customerId  : 1337,
                    supplierId  : 42,
                    requestType : RequestType.AB,
                    requestId   : 987654321,
                    text        : 'Baz',
                    operationId : 123456789,
                    deliveryDate: new Date(2017, 8, 19),
                    currency    : 'USD',
                    version     : '04.00',
                    name        : 'Foo Bar',
                    date        : new Date(2017, 7, 16)
                });
                
                
                expect(builder.getWriter().toString()).to.match(/^KOP0{6}13370{8}42AB0{6}987654321Baz {47}0{6}12345678920170919USD04.00Foo Bar {33}20170816\r\n$/m);
            });
            
            for(let requestType of [ RequestType.TB, RequestType.BE ]) {
                it(`should validate required deliveryDate on requestType ${requestType}`, () => {
                    expect(() => {
                        builder.kop({ requestType });
                    }).to.throw('DeliveryDate required');
                });
            }
            
            it('should throw on duplicate kop', () => {
                builder.kop({ requestType: RequestType.AB });
                
                expect(() => {
                    builder.kop({ requestType: RequestType.AB });
                }).to.throw('KOP already written');
            });
            
            it('should throw on kop after end', () => {
                builder.kop({ requestType: RequestType.AB });
                builder.end();
                
                expect(() => {
                    builder.kop({ requestType: RequestType.AB });
                }).to.throw('END already written');
            })
        });
        
        describe('#adr', () => {
            it('should throw if no kop', () => {
                expect(() => {
                    builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                }).to.throw('Required KOP');
            });
    
            it('should throw after end', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end();
                expect(() => {
                    builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                }).to.throw('END already written');
            });
            
            it('should write line', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz', country: 'GER' });
                builder.end();
                
                let parts = builder.getWriter().toString().split(/\r\n/);
                
                expect(parts[1]).to.match(/^ADRFoo Bar {83}Example Street 1 {14}   12345 Baz {27}$/)
                expect(parts[2]).to.match(/^ADRFoo Bar {83}Example Street 1 {14}GER12345 Baz {27}$/)
            });
            
            it('should write name', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                builder.adr({ name: [ 'Foo Bar' ], street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                builder.adr({ name: [ 'Foo', 'Bar' ], street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                builder.adr({ name: [ 'Foo', 'Bar', 'Baz' ], street: 'Example Street 1', postalCode: '12345', city: 'Baz' });
                builder.end();
    
                let parts = builder.getWriter().toString().split(/\r\n/);
    
                expect(parts[ 1 ].substr(3, 30)).to.match(/^Foo Bar {23}$/);
                expect(parts[ 1 ].substr(33, 30)).to.match(/^ {30}$/);
                expect(parts[ 1 ].substr(63, 30)).to.match(/^ {30}$/);
    
                expect(parts[ 2 ].substr(3, 30)).to.match(/^Foo Bar {23}$/);
                expect(parts[ 2 ].substr(33, 30)).to.match(/^ {30}$/);
                expect(parts[ 2 ].substr(63, 30)).to.match(/^ {30}$/);
                
                expect(parts[ 3 ].substr(3, 30)).to.match(/^Foo {27}$/);
                expect(parts[ 3 ].substr(33, 30)).to.match(/^Bar {27}$/);
                expect(parts[ 3 ].substr(63, 30)).to.match(/^ {30}$/);
                
                expect(parts[ 4 ].substr(3, 30)).to.match(/^Foo {27}$/);
                expect(parts[ 4 ].substr(33, 30)).to.match(/^Bar {27}$/);
                expect(parts[ 4 ].substr(63, 30)).to.match(/^Baz {27}$/);
            })
        });
        
        describe('#poa', () => {
            it('should throw if no kop', () => {
                expect(() => builder.poa({ articleNumber: '', gross: 13 })).to.throw('Required KOP');
            });
            
            it('should throw after end', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end();
                expect(() => builder.poa({ articleNumber: '', gross: 13 })).to.throw('END already written');
            });
            
            describe('for craftsman', () => {
                beforeEach(() => {
                    builder = new UGLBuilder(writer, Mode.Craftsman);
                    
                    builder.kop({ requestType: RequestType.BE, deliveryDate: '20170918' });
                });
                
                it('should write poa with minimal data', () => {
                    builder.poa({ articleNumber: '001234', gross: 13.37 });
                    builder.end();
                    
                    expect(builder.getWriter().toString()).to.match(
                        /\r\nPOA0{9}10{10}001234 {9}0{7}1000 {80}0{7}1337 0{7}13370{5}0{5}0{17}1 HNStk  \r\n/
                    )
                });
                
                it('should write poa with maximal data', () => {
                    builder.poa({
                        positionCraftsman: 10,
                        positionWholesale: 0,
                        articleNumber    : '000000123456789',
                        quantity         : 1,
                        name             : [ 'Foo', 'Bar' ],
                        gross            : 12345.6,
                        priceUnit        : '0',
                        net              : 12345.6,
                        discount         : [ 0, 0 ],
                        index            : 18,
                        alternative      : false,
                        type             : PositionType.Jumbo,
                        reservation      : true,
                        quantityUnit     : 'Pkg',
                        pkz              : 'T',
                        storeType        : StoreType.Order,
                    });
                    builder.end();
                    
                    expect(builder.getWriter().toString()).to.match(
                        /\r\nPOA0{8}100{10}0000001234567890{7}1000Foo {37}Bar {37}000012345600000012345600{5}0{5}0{16}18 JJPkgTB\r\n/
                    );
                });
                
                it('should autofill position and index for craftsman', () => {
                    builder.poa({ articleNumber: '001234', gross: 13.37 });
                    builder.poa({ articleNumber: '001235', gross: 13.37 });
                    builder.end();
                    
                    let parts = builder.getWriter().toString().split(/\r\n/);
                    
                    expect(parts[ 1 ].substr(3, 10)).to.be.eql('0000000001', 'position #1');
                    expect(parts[ 2 ].substr(3, 10)).to.be.eql('0000000002', 'position #2');
                    
                    expect(parts[ 1 ].substr(13, 10)).to.be.eql('0000000000', 'position wholesale #1');
                    expect(parts[ 2 ].substr(13, 10)).to.be.eql('0000000000', 'position wholesale #2');
                    
                    expect(parts[ 1 ].substr(162, 18)).to.be.eql('000000000000000001', 'index #1');
                    expect(parts[ 2 ].substr(162, 18)).to.be.eql('000000000000000002', 'index #2');
                })
            });
            
            describe('for wholesale', () => {
                beforeEach(() => {
                    builder = new UGLBuilder(writer, Mode.Wholesale);
                    
                    builder.kop({ requestType: RequestType.AB, deliveryDate: '20170918' });
                });
                
                it('should write poa with minimal data', () => {
                    builder.poa({ articleNumber: '001234', gross: 13.37 });
                    builder.end();
                    
                    expect(builder.getWriter().toString()).to.match(
                        /\r\nPOA0{10}0{9}1001234 {9}0{7}1000 {80}0{7}1337 0{7}13370{5}0{5}0{17}1 HNStk  \r\n/
                    )
                });
                
                it('should write poa with maximal data', () => {
                    builder.poa({
                        positionCraftsman: 0,
                        positionWholesale: 11,
                        articleNumber    : '000000123456789',
                        quantity         : 1,
                        name             : [ 'Foo', 'Bar' ],
                        gross            : 12345.6,
                        priceUnit        : '0',
                        net              : 12345.6,
                        discount         : [ 0, 0 ],
                        index            : 21,
                        alternative      : true,
                        type             : PositionType.Jumbo,
                        reservation      : true,
                        quantityUnit     : 'Pkg',
                        pkz              : 'T',
                        storeType        : StoreType.Order,
                    });
                    builder.end();
                    
                    expect(builder.getWriter().toString()).to.match(
                        /\r\nPOA0{10}0{8}110000001234567890{7}1000Foo {37}Bar {37}000012345600000012345600{5}0{5}0{16}21AJJPkgTB\r\n/
                    );
                });
                
                it('should autofill position and index for wholesale', () => {
                    builder.poa({ articleNumber: '001234', gross: 13.37 });
                    builder.poa({ articleNumber: '001235', gross: 13.37 });
                    builder.end();
                    
                    let parts = builder.getWriter().toString().split(/\r\n/);
                    
                    expect(parts[ 1 ].substr(13, 10)).to.be.eql('0000000001', 'position #1');
                    expect(parts[ 2 ].substr(13, 10)).to.be.eql('0000000002', 'position #2');
                    
                    expect(parts[ 1 ].substr(3, 10)).to.be.eql('0000000000', 'position craftsman #1');
                    expect(parts[ 2 ].substr(3, 10)).to.be.eql('0000000000', 'position craftsman #2');
                    
                    expect(parts[ 1 ].substr(162, 18)).to.be.eql('000000000000000001', 'index #1');
                    expect(parts[ 2 ].substr(162, 18)).to.be.eql('000000000000000002', 'index #2');
                })
            });
            
            it('should calculate net', () => {
                builder.kop({ requestType: RequestType.AB, deliveryDate: '20170918' });
                builder.poa({ articleNumber: '001235', gross: 13.37, quantity: 5 });
                builder.end();
                
                let parts = builder.getWriter().toString().split(/\r\n/);
                
                expect(parts[ 1 ].substr(141, 11)).to.be.eql('00000006685');
            });
            
            it('should write name', () => {
                builder.kop({ requestType: RequestType.AB, deliveryDate: '20170918' });
                builder.poa({ articleNumber: '001235', gross: 13.37, name: 'Foobar' });
                builder.poa({ articleNumber: '001235', gross: 13.37, name: [ 'Foobar' ] });
                builder.poa({ articleNumber: '001235', gross: 13.37, name: [ 'Foo', 'Bar' ] });
                builder.poa({ articleNumber: '001235', gross: 13.37, name: [ ] });
                builder.end();
                
                let parts = builder.getWriter().toString().split(/\r\n/);
    
    
                expect(parts[ 1 ].substr(49, 40)).to.match(/^Foobar {34}$/);
                expect(parts[ 1 ].substr(89, 40)).to.match(/^ {40}$/);
                
                expect(parts[ 2 ].substr(49, 40)).to.match(/^Foobar {34}$/);
                expect(parts[ 2 ].substr(89, 40)).to.match(/^ {40}$/);
                
                expect(parts[ 3 ].substr(49, 40)).to.match(/^Foo {37}$/);
                expect(parts[ 3 ].substr(89, 40)).to.match(/^Bar {37}$/);
                
                expect(parts[ 4 ].substr(49, 40)).to.match(/^ {40}$/);
                expect(parts[ 4 ].substr(89, 40)).to.match(/^ {40}$/);
            });
            
            it('should write discount', () => {
                builder.kop({ requestType: RequestType.AB, deliveryDate: '20170918' });
                builder.poa({ articleNumber: '001235', gross: 13.37, discount: 13.37 });
                builder.poa({ articleNumber: '001235', gross: 13.37, discount: [ 13.37 ] });
                builder.poa({ articleNumber: '001235', gross: 13.37, discount: [ 42, 6.8 ] });
                builder.poa({ articleNumber: '001235', gross: 13.37, discount: [ ] });
                builder.end();
                
                let parts = builder.getWriter().toString().split(/\r\n/);
    
    
                expect(parts[ 1 ].substr(152, 5)).to.be.eql('01337');
                expect(parts[ 1 ].substr(157, 5)).to.be.eql('00000');
                
                expect(parts[ 2 ].substr(152, 5)).to.be.eql('01337');
                expect(parts[ 2 ].substr(157, 5)).to.be.eql('00000');
                
                expect(parts[ 3 ].substr(152, 5)).to.be.eql('04200');
                expect(parts[ 3 ].substr(157, 5)).to.be.eql('00680');
                
                expect(parts[ 4 ].substr(152, 5)).to.be.eql('00000');
                expect(parts[ 4 ].substr(157, 5)).to.be.eql('00000');
            });
        });
        
        describe('#end', () => {
            it('should throw if no kop', () => {
                expect(() => builder.end()).to.throw('Required KOP');
            });
            
            it('should throw on duplicate end', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end();
                expect(() => builder.end()).to.throw('END already written');
            });
            
            it('should write empty text', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end();
                
                expect(builder.getWriter().toString()).to.match(/\r\nEND {160}$/)
            });
            
            it('should write text as string', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end({ text: 'Foobar' });
                
                expect(builder.getWriter().toString()).to.match(/\r\nENDFoobar {154}$/)
            });
            
            it('should write text as [ string, string ]', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end({ text: [ 'Foobar', 'Baz' ] });
                
                expect(builder.getWriter().toString()).to.match(/\r\nENDFoobar {34}Baz {37} {80}$/)
            });
            
            it('should write text as [ string, string, string, string ]', () => {
                builder.kop({ requestType: RequestType.AN });
                builder.end({ text: [ 'A', 'B', 'C', 'D' ] });
                
                expect(builder.getWriter().toString()).to.match(/\r\nENDA {39}B {39}C {39}D {39}$/)
            });
        })
    })
});
