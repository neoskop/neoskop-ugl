import { kop, adr, poa, pot, poz, end, rgd } from './raw';

describe('raw', () => {
    describe('kop', () => {
        it('should write kop', () => {
            const result = kop({
                kind: 'KOP',
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
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(/^KOP0{6}13370{8}42AB0{6}987654321Baz {47}0{6}12345678920170919USD04.00Foo Bar {33}20170816 *\r\n$/m);
        });
    });

    describe('adr', () => {
        it('should write adr', () => {
            const result = adr({
                kind: 'ADR',
                name: ['Foo Bar', '', ''],
                street: 'Example Street 1',
                postalCode: '12345',
                city: 'Baz',
                country: 'GER'
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(/^ADRFoo Bar {83}Example Street 1 {14}GER12345 Baz {27} *\r\n$/);
        });
    });

    describe('poa', () => {
        it('should write poa', () => {
            const result = poa({
                kind: 'POA',
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
                type: 'H',
                reservation: true,
                quantityUnit: 'Pkg',
                pkz: 'T',
                storeType: 'B'
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(
                /^POA0{8}100{10}0000001234567890{7}1000Foo {37}Bar {37}000012345600000012345600{5}0{5}0{16}18 HJPkgTB *\r\n$/
            );
        });
    });

    describe('pot', () => {
        it('should write pot', () => {
            const result = pot({
                kind: 'POT',
                positionCraftsman: 10,
                positionWholesale: 0,
                text: ['Foo', 'Bar', 'Baz'],
                index: 18
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(/^POT0{8}100{10}Foo {37}Bar {37}Baz {37}0{16}18 *\r\n$/);
        });
    });

    describe('poz', () => {
        it('should write poz', () => {
            const result = poz({
                kind: 'POZ',
                positionCraftsman: 10,
                positionWholesale: 18,
                type: '99',
                description: 'Foobar',
                dayRate: 12345.6,
                net: 987654
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(/^POZ0{8}100{8}1899Foobar {74}0000123456000098765400 *\r\n$/);
        });
    });

    describe('end', () => {
        it('should write end', () => {
            const result = end({
                kind: 'END',
                text: ['A', 'B', 'C', 'D']
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(/^ENDA {39}B {39}C {39}D {39} *\r\n$/);
        });
    });

    describe('rgd', () => {
        it('should write rgd', () => {
            const result = rgd({
                kind: 'RGD',
                invoiceId: '1234',
                documentType: 'RG',
                documentDate: new Date('2024-01-19'),
                currency: 'EUR',
                gross: 1337.42,
                vatAmount: 1337.42,
                vat: 0.19,
                net: 1234.56,
                discountValue: [123, 12.34],
                discountPercent: [5, 10],
                discountDate: ['20240131', '20240228'],
                dueDate: '20240401',
                discountAmount: 42
            });

            expect(result).toHaveLength(202);
            expect(result).toMatch(
                /^RGD1234 {6}RG20240119EUR000001337420000013374200019000001234560000001230000500202401310000000123401000202402282024040100000004200 *\r\n$/
            );
        });
    });
});
