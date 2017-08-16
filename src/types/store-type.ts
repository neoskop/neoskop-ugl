/**
 * 3.4 Satzart KOP :: Lagerkennzeichen
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export enum StoreType {
    /**
     * @desc Artikel ist Lagerware
     */
    Store = 'L',
    
    /**
     * @desc Artikel ist Bestellware
     */
    Order = 'B'
}
