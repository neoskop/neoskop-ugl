/**
 * 3.3 Satzart ADR
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface Adr {
    kind?: 'ADR';

    /**
     * @see Name 1-3
     */
    name: string | [string] | [string, string] | [string, string, string];

    /**
     * @see Straße
     */
    street: string;

    /**
     * empty for Germany respectively own country
     * @see Land
     */
    country?: string;

    /**
     * @see Postleitzahl
     */
    postalCode: string;

    /**
     * @see Ort
     */
    city: string;
}
