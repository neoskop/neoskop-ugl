/**
 * 3.2 Anfragearten
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export const RequestType = {
    /**
     * @desc Preisanfrage des HW beim GH
     */
    AN: 'AN',

    /**
     * @desc Preisangebot des GH zum HW
     */
    PA: 'PA',

    /**
     * @desc Lieferauftrag/Bestellung des HW beim GH
     */
    BE: 'BE',

    /**
     * @desc Auftragsbestätigung des GH zum HW
     */
    AB: 'AB',

    /**
     * @desc Abrufauftrag des HW beim GH
     */
    TB: 'TB'
} as const;
export type RequestType = (typeof RequestType)[keyof typeof RequestType];

/**
 * 3.1 Satzart KOP
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface Kop {
    kind?: 'KOP';

    /**
     * @see Rechnungsnummer des GH
     */
    requestType: RequestType;

    /**
     * @see Kundennummer des Handwerkers(HW) beim Großhändler(GH)
     */
    customerId?: number;

    /**
     * @see Lieferantennummer des GH beim HW
     */
    supplierId?: number;

    /**
     * @see Anfragenummer des HW
     */
    requestId?: number;

    /**
     * @see Kundenauftragstext
     */
    text?: string;

    /**
     * @see Vorgangsnummer des GH
     */
    operationId?: number;

    /**
     * @see Gewünschtes Lieferdatum des HW
     */
    deliveryDate?: string | Date;

    /**
     * @see Währungskennzeichen
     * @example EUR, USD
     */
    currency?: string;

    /**
     * @see Versionskennzeichen
     * @default 04.00
     */
    version?: string;

    /**
     * @see Name des verantwortlichen Sachbearbeiters des Sendenden
     */
    name?: string;

    /**
     * @see Vorgangs-/Dokumentendatum
     */
    date?: string | Date;
}
