import { UGLEncoding } from './encoding';

describe('UGLEncoding', () => {
    describe('utf8ToAscii', () => {
        it.each([
            ['a', ['a'.charCodeAt(0)]],
            ['ä', [0xc3, 0xa4]],
            ['€', [0xe2, 0x82, 0xac]],
            ['𝄞', [0xf0, 0x9d, 0x84, 0x9e]]
        ] as const)('should convert "%s" from utf8 to ascii', (input, expected) => {
            expect(UGLEncoding.utf8ToAscii(input)).toEqual(String.fromCharCode(...expected));
        });
    });

    describe('string', () => {
        it('should crop from right when to long', () => {
            expect(UGLEncoding.string('Foobar', 3)).toEqual('Foo');
        });

        it('should pad to right when to short', () => {
            expect(UGLEncoding.string('Foobar', 10)).toEqual('Foobar    ');
        });

        it.each([
            ['ä', String.fromCharCode(0xc3, 0xa4) + '        ', 10],
            ['µ', String.fromCharCode(0xc2), 1]
        ] as const)('should encode non-ascii character "%s"', (input, expected, length) => {
            expect(UGLEncoding.string(input, length)).toEqual(expected);
        });
    });

    describe('int', () => {
        it('should crop from right when to long', () => {
            expect(UGLEncoding.int(1234, 3)).toEqual('123');
        });

        it('should pad to left when to short', () => {
            expect(UGLEncoding.int(1234, 10)).toEqual('0000001234');
        });
    });

    describe('float', () => {
        it('should pad to left and right correctly', () => {
            expect(UGLEncoding.float(1234.56, 10, 3)).toEqual('0001234560');
        });
    });

    describe('date', () => {
        it('should should validate string input', () => {
            expect(() => {
                UGLEncoding.date('abcdefgh');
            }).toThrow('Date field required format YYYYMMDD, "abcdefgh" given.');
        });

        it('should use correct string value', () => {
            expect(UGLEncoding.date('20170527')).toEqual('20170527');
        });

        it('should format Date object', () => {
            expect(UGLEncoding.date(new Date(2015, 7, 13))).toEqual('20150813');
        });
    });

    describe('Builder', () => {
        let builder: UGLEncoding.Builder;

        beforeEach(() => {
            builder = new UGLEncoding.Builder();
        });

        describe('string', () => {
            it('should crop from right when to long', () => {
                expect(builder.string('Foobar', 3).build()).toEqual('Foo'.padEnd(200, ' ') + UGLEncoding.NL);
            });

            it('should pad to right when to short', () => {
                expect(builder.string('Foobar', 10).build()).toEqual('Foobar    '.padEnd(200, ' ') + UGLEncoding.NL);
            });

            it.each([
                ['ä', String.fromCharCode(0xc3, 0xa4) + '        ', 10],
                ['µ', String.fromCharCode(0xc2), 1]
            ] as const)('should encode non-ascii character "%s"', (input, expected, length) => {
                expect(builder.string(input, length).build()).toEqual(expected.padEnd(200, ' ') + UGLEncoding.NL);
            });
        });

        describe('int', () => {
            it('should crop from right when to long', () => {
                expect(builder.int(1234, 3).build()).toEqual('123'.padEnd(200, ' ') + UGLEncoding.NL);
            });

            it('should pad to left when to short', () => {
                expect(builder.int(1234, 10).build()).toEqual('0000001234'.padEnd(200, ' ') + UGLEncoding.NL);
            });
        });

        describe('float', () => {
            it('should pad to left and right correctly', () => {
                expect(builder.float(1234.56, 10, 3).build()).toEqual('0001234560'.padEnd(200, ' ') + UGLEncoding.NL);
            });
        });

        describe('date', () => {
            it('should should validate string input', () => {
                expect(() => {
                    builder.date('abcdefgh').build();
                }).toThrow('Date field required format YYYYMMDD, "abcdefgh" given.');
            });

            it('should use correct string value', () => {
                expect(builder.date('20170527').build()).toEqual('20170527'.padEnd(200, ' ') + UGLEncoding.NL);
            });

            it('should format Date object', () => {
                expect(builder.date(new Date(2015, 7, 13)).build()).toEqual('20150813'.padEnd(200, ' ') + UGLEncoding.NL);
            });
        });
    });
});
