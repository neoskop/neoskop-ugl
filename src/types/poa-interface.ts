import { PositionType } from './position-type';
import { StoreType } from './store-type';

/**
 * 3.4 Satzart POA
 * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
 */
export interface IPoa {
    /**
     * @see Positionsnummer des HW
     */
    positionCraftsman?: number;
    
    /**
     * @see Positionnummer des GH
     */
    positionWholesale?: number;
    
    /**
     * @see Artikelnummer
     */
    articleNumber: string;
    
    /**
     * @see Auftrags-/Nachfragemenge
     * @default 1
     */
    quantity?: number;
    
    /**
     * @see Artikelbezeichnung 1-2
     */
    name?: string|string[];
    
    /**
     * @see Einzelpreis Brutto
     */
    gross: number;
    
    /**
     * Gross price per X units
     * @see Preiseinheit gemäß Datanorm 4.0
     * @example '' or '0' = per unit
     *          '1' = per 10 units
     *          '2' = per 100 units
     *          '3' = per 1000 units
     */
    priceUnit?: ''|'0'|'1'|'2'|'3';
    
    /**
     * @see Netto Positionswert
     * @default {gross * quantity}
     */
    net?: number;
    
    /**
     * @see Rabatt 1-2
     */
    discount?: number|number[];
    
    /**
     * @see Leistungsverzeichnis Nummer (LV-Nummer)
     */
    index?: number;
    
    /**
     * @see Kennzeichen Alternativ Position
     */
    alternative?: boolean;
    
    /**
     * @see Positionstyp
     */
    type?: PositionType;
    
    /**
     * @see Vorbehaltlich technischer Klärung
     */
    reservation?: boolean;
    
    /**
     * @see Mengeneinheit
     * @default Stk
     */
    quantityUnit?: any;
    
    /**
     * @see Preis-Kz.
     */
    pkz?: any;
    
    /**
     * @see Lagerkennzeichen
     */
    storeType?: StoreType;
}
