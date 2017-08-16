/**
 * 3.4 Satzart KOP :: Positionstyp
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export enum PositionType {
    /**
     * @desc Reguläre Artikel Hauptposition
     */
    Regular = 'H',
    
    /**
     * @desc Jumbo Hauptposition
     */
    Jumbo = 'J',
    
    /**
     * @desc Jumbo Unterposition
     */
    JumboSub = 'U'
}
