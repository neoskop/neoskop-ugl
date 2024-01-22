/**
 * 3.5 Satzart POT
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface Pot {
    kind?: 'POT';

    /**
     * @see Positionsnummer des HW
     */
    positionCraftsman?: number;

    /**
     * @see Positionnummer des GH
     */
    positionWholesale?: number;

    /**
     * @see Infotext 1-3
     */
    text: string | string[];

    /**
     * @see Leistungsverzeichnis Nummer
     */
    index?: number;
}
