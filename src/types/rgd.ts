/**
 * 3.8 Satzart Rechnungs-Daten RGD :: Belegart
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export const DocumentType = {
    /**
     * @desc Rechnung
     */
    Invoice: 'RG',

    /**
     * @desc Gutschrift
     */
    Credit: 'GS',

    /**
     * @desc Lieferschein (inoffiziel)
     */
    DeliverySlip: 'LS'
};
export type DocumentType = (typeof DocumentType)[keyof typeof DocumentType];

/**
 * 3.8 Satzart Rechnungs-Daten RGD
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface Rgd {
    kind?: 'RGD';

    /**
     * @see Rechnungsnummer des GH
     */
    invoiceId: string;

    /**
     * @see Straße
     */
    documentType: DocumentType;

    /**
     * @see Belegdatum
     */
    documentDate: string | Date;

    /**
     * @see Währungskennzeichen
     * @example EUR, USD
     */
    currency: string;

    /**
     * @see Brutte Rechnungsbetrag
     */
    gross: number;

    /**
     * @see Mehrwertsteuerbetrag
     */
    vatAmount: number;

    /**
     * @see MwSt % Satz
     */
    vat: number;

    /**
     * @see Netto Warenwert
     */
    net: number;

    /**
     * @see Skonto Betrag 1/2
     */
    discountValue?: [number, number];

    /**
     * @see Skonto in % 1/2
     */
    discountPercent?: [number, number];

    /**
     * @see Skonto Datum 1/2
     */
    discountDate?: [string | Date, string | Date];

    /**
     * @see Netto Fälligkeitsdatum
     */
    dueDate?: string | Date;

    /**
     * @see Skontofähiger Betrag
     */
    discountAmount: number;
}
