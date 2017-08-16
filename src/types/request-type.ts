/**
 * 3.2 Anfragearten
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export enum RequestType {
    /**
     * @desc Preisanfrage des HW beim GH
     */
    AN = 'AN',
    
    /**
     * @desc Preisangebot des GH zum HW
     */
    PA = 'PA',
    
    /**
     * @desc Lieferauftrag/Bestellung des HW beim GH
     */
    BE = 'BE',
    
    /**
     * @desc Auftragsbestätigung des GH zum HW
     */
    AB = 'AB',
    
    /**
     * @desc Abrufauftrag des HW beim GH
     */
    TB = 'TB'
}
