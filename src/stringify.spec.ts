import { stringify } from './stringify';

describe('stringify', () => {
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-19'));
    });

    it('should write kop with default values', () => {
        const result = stringify([{ kind: 'KOP', requestType: 'AB' }]);

        expect(result).toMatch(/^KOP0{10}0{10}AB\d{15} {50}0{15}0{8}EUR04.00 {40}20240119 *\r\n$/);
    });

    it('should write adr with default values', () => {
        const result = stringify([{ kind: 'ADR', name: 'Foo Bar', street: 'Example Street 1', postalCode: '12345', city: 'Baz' }]);

        expect(result).toMatch(/^ADRFoo Bar {83}Example Street 1 {14}   12345 Baz {27} *$/m);
    });

    it('should write poa with default values', () => {
        const result = stringify([{ kind: 'POA', articleNumber: '001234', gross: 13.37 }]);

        expect(result).toMatch(/^POA0{9}10{10}001234 {9}0{7}1000 {80}0{7}1337 0{7}13370{5}0{5}0{17}1 HNStk *$/m);
    });

    it('should write pot with default values', () => {
        const result = stringify([{ kind: 'POT', text: 'Foobar' }]);

        expect(result).toMatch(/^POT0{9}10{10}Foobar {114}0{17}1 *$/m);
    });

    it('should write poz with default values', () => {
        const result = stringify([{ kind: 'POZ', type: '03', net: 13.37 }]);

        expect(result).toMatch(/^POZ0{9}10{10}03 {80}0{11}0{7}1337 *$/m);
    });

    it('should write end with default values', () => {
        const result = stringify([{ kind: 'END' }]);

        expect(result).toMatch(/^END *$/m);
    });

    it('should write rgd with default values', () => {
        const result = stringify([
            {
                kind: 'RGD',
                invoiceId: '1234',
                documentType: 'RG',
                documentDate: '20240119',
                gross: 1337.42,
                net: 42,
                vatAmount: 42,
                vat: 0.19,
                currency: 'EUR',
                discountAmount: 42
            }
        ]);

        expect(result).toMatch(/^RGD1234 {6}RG20240119EUR0{5}1337420{7}4200000190{7}42000{11}0{5}0{8}0{11}0{5}0{8}0{8}0{7}4200 *$/m);
    });
});
