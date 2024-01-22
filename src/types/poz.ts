/**
 * 3.6 Satzart POZ
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface Poz {
    kind?: 'POZ';

    /**
     * @see Positionsnummer des HW
     */
    positionCraftsman?: number;

    /**
     * @see Positionnummer des GH
     */
    positionWholesale?: number;

    /**
     * @see Zuschlagstyp
     */
    type: string;

    /**
     * @see Zuschlagsbezeichnung
     */
    description?: string;

    /**
     * @see Tagespreis (DEL-Notation)
     */
    dayRate?: number;

    /**
     * @see Netto-Positionswert
     */
    net: number;
}
