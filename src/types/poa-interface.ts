import { PositionType } from './position-type';
import { StoreType } from './store-type';

export interface IPoa {
    positionCraftsman?: number;
    positionWholesale?: number;
    articleNumber: string;
    quantity?: number;
    name?: string|string[];
    gross: number;
    priceUnit?: ''|'0'|'1'|'2'|'3' // gross per 1 / 10 / 100 / 1000 units
    net?: number;
    discount?: number|number[];
    index: number;
    alternative?: boolean;
    type?: PositionType;
    reservation?: boolean;
    quantityUnit?: any;
    pkz?: any;
    storeType?: StoreType;
}
