import { Builder, split } from './builder';

describe('Builder', () => {
    let builder: Builder;

    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-19'));
        builder = new Builder();
    });

    describe('kop', () => {
        it('should write kop with default values', () => {
            const result = builder.kop({ requestType: 'AB' }).build();

            expect(result).toMatch(/^KOP0{10}0{10}AB\d{15} {50}0{15}0{8}EUR04.00 {40}20240119 *\r\n$/);
        });

        it('should write kop with given values', () => {
            const result = builder
                .kop({
                    customerId: 1337,
                    supplierId: 42,
                    requestType: 'AB',
                    requestId: 987654321,
                    text: 'Baz',
                    operationId: 123456789,
                    deliveryDate: new Date(2017, 8, 19),
                    currency: 'USD',
                    version: '04.00',
                    name: 'Foo Bar',
                    date: new Date(2017, 7, 16)
                })
                .build();

            expect(result).toMatch(/^KOP0{6}13370{8}42AB0{6}987654321Baz {47}0{6}12345678920170919USD04.00Foo Bar {33}20170816 *$/m);
        });

        it.each([['TB'], ['BE']] as const)(`should validate required deliveryDate on requestType %s`, requestType => {
            expect(() => {
                builder.kop({ requestType });
            }).toThrow('DeliveryDate required');
        });
    });

    describe('adr', () => {
        it('should write adr with default values', () => {
            const result = builder.adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' }).build();

            expect(result).toMatch(/^ADRFoo Bar {83}Example Street 1 {14}   12345 Baz {27} *$/m);
        });

        it('should write adr with given values', () => {
            const result = builder
                .adr({ name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz', country: 'GER' })
                .build();

            expect(result).toMatch(/^ADRFoo Bar {83}Example Street 1 {14}GER12345 Baz {27} *$/m);
        });
    });

    describe('poa', () => {
        it('should write poa with default values', () => {
            const result = builder.poa({ articleNumber: '001234', gross: 13.37 }).build();

            expect(result).toMatch(/^POA0{9}10{10}001234 {9}0{7}1000 {80}0{7}1337 0{7}13370{5}0{5}0{17}1 HNStk *$/m);
        });

        it('should write poa with given values', () => {
            const result = builder
                .poa({
                    positionCraftsman: 10,
                    positionWholesale: 0,
                    articleNumber: '000000123456789',
                    quantity: 1,
                    name: ['Foo', 'Bar'],
                    gross: 12345.6,
                    priceUnit: '0',
                    net: 12345.6,
                    discount: [0, 0],
                    index: 18,
                    alternative: false,
                    type: 'J',
                    reservation: true,
                    quantityUnit: 'Pkg',
                    pkz: 'T',
                    storeType: 'B'
                })
                .build();

            expect(result).toMatch(
                /^POA0{8}100{10}0000001234567890{7}1000Foo {37}Bar {37}000012345600000012345600{5}0{5}0{16}18 JJPkgTB *$/m
            );
        });
    });

    describe('pot', () => {
        it('should write pot with default values', () => {
            const result = builder.pot({ text: 'Foobar' }).build();

            expect(result).toMatch(/^POT0{9}10{10}Foobar {114}0{17}1 *$/m);
        });

        it('should write pot with given values', () => {
            const result = builder
                .pot({
                    positionCraftsman: 10,
                    positionWholesale: 0,
                    text: ['Foo', 'Bar', 'Baz'],
                    index: 18
                })
                .build();

            expect(result).toMatch(/^POT0{8}100{10}Foo {37}Bar {37}Baz {37}0{16}18 *$/m);
        });
    });

    describe('poz', () => {
        it('should write poz with default values', () => {
            const result = builder.poz({ type: '03', net: 13.37 }).build();

            expect(result).toMatch(/^POZ0{9}10{10}03 {80}0{11}0{7}1337 *$/m);
        });

        it('should write poz with given values', () => {
            const result = builder
                .poz({
                    positionCraftsman: 10,
                    positionWholesale: 18,
                    type: '99',
                    description: 'Foobar',
                    dayRate: 12345.6,
                    net: 987654
                })
                .build();

            expect(result).toMatch(/^POZ0{8}100{8}1899Foobar {74}0000123456000098765400 *$/m);
        });

        it('should throw on missing description for type 99', () => {
            expect(() => {
                builder.poz({ type: '99', net: 0 });
            }).toThrow('Field "description" is required for type "99"');
        });

        it('should throw on invalid type', () => {
            expect(() => {
                builder.poz({ type: '2', net: 0 });
            }).toThrow('Invalid type "2"');
            expect(() => {
                builder.poz({ type: '02', net: 0 });
            }).not.toThrow();
            expect(() => {
                builder.poz({ type: 'C', net: 0 });
            }).toThrow('Invalid type "C"');
            expect(() => {
                builder.poz({ type: 'CU', net: 0 });
            }).not.toThrow();
        });
    });

    describe('end', () => {
        it('should write end with default values', () => {
            const result = builder.end().build();

            expect(result).toMatch(/^END *$/m);
        });

        it('should write end with given values', () => {
            const result = builder.end({ text: 'Foobar' }).build();

            expect(result).toMatch(/^ENDFoobar *$/m);
        });
    });

    describe('rgd', () => {
        it('should write rgd with default values', () => {
            const result = builder
                .rgd({
                    invoiceId: '1234',
                    documentType: 'RG',
                    documentDate: '20240119',
                    gross: 1337.42,
                    net: 42,
                    vatAmount: 42,
                    vat: 0.19,
                    currency: 'EUR',
                    discountAmount: 42
                })
                .build();

            expect(result).toMatch(/^RGD1234 {6}RG20240119EUR0{5}1337420{7}4200000190{7}42000{11}0{5}0{8}0{11}0{5}0{8}0{8}0{7}4200 *$/m);
        });
    });
});

describe('split', () => {
    it('should split string into array', () => {
        expect(split('', 3, 30)).toEqual(['', '', '']);
        const Foo = 'Foo'.repeat(10);
        const Bar = 'Bar'.repeat(10);
        const Baz = 'Baz'.repeat(10);
        expect(split(Foo + Bar + Baz, 3, 30)).toEqual([Foo, Bar, Baz]);
    });

    it('should fill array up to desired length', () => {
        expect(split(['Foo'], 3, 30)).toEqual(['Foo', '', '']);
    });
});
