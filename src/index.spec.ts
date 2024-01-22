import UGL, { Builder } from './index';
describe('UGL', () => {
    it('should export UGL namespace as default', () => {
        expect(UGL).toBeInstanceOf(Object);
    });

    it('should export Builder in UGL namespace', () => {
        expect(UGL.Builder).toBeInstanceOf(Function);
    });

    it('should export stringify in UGL namespace', () => {
        expect(UGL.stringify).toBeInstanceOf(Function);
    });

    it('should export raw in UGL namespace', () => {
        expect(UGL.raw).toBeDefined();
    });

    it('should export Builder as named export', () => {
        expect(Builder).toBeInstanceOf(Function);
    });
});
