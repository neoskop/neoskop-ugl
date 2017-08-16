import { IKop } from '../types/kop-interface';
import { RequestType } from '../types/request-type';
import { uid } from '../utils/uid';
import { IUGLWriter } from '../writer/writer-interface';
import { RecordType } from '../types/record-type';
import { IPoa } from '../types/poa-interface';
import { Mode } from '../types/mode';
import { PositionType } from "../types/position-type";
import { IEnd } from '../types/end-interface';
import { IAdr } from '../types/adr-interface';
import { IPot } from '../types/pot-interface';
import { IPoz } from '../types/poz-interface';

export class UGLBuilder<T extends IUGLWriter> {
    protected wroteKop : boolean = false;
    protected wroteEnd : boolean = false;
    
    protected runningPosition : number = 0;
    protected runningIndex : number = 0;
    
    constructor(protected writer : T,
                protected readonly mode : Mode = Mode.Craftsman) {
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.1 Satzart KOP
     */
    kop(data : IKop) : this {
        if(this.wroteEnd) {
            throw new Error('END already written');
        }
        if(this.wroteKop) {
            throw new Error(`KOP already written`);
        }
        
        let {
            customerId = 0,
            supplierId = 0,
            requestType,
            requestId = uid(15),
            text = '',
            operationId = 0,
            deliveryDate = '00000000',
            currency = 'EUR',
            version = '04.00',
            name = '',
            date = new Date()
        } = data;
        
        if(requestType === RequestType.TB || requestType === RequestType.BE) {
            if(!deliveryDate || deliveryDate == '00000000') {
                throw new Error(`DeliveryDate required`);
            }
        }
        
        this.writer
            .string(RecordType.KOP, 3)
            .int(customerId, 10)
            .int(supplierId, 10)
            .string(requestType, 2)
            .int(requestId, 15)
            .string(text, 50)
            .int(operationId, 15)
            .date(deliveryDate)
            .string(currency, 3)
            .string(version, 5)
            .string(name, 40)
            .date(date)
            .nl();
        
        this.wroteKop = true;
        return this;
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.3 Satzart ADR
     */
    adr(data : IAdr) : this {
        this.check();
        
        let {
            name,
            street,
            country = '',
            postalCode,
            city
        } = data;
    
        
        name = this.scalarToArray(name, '', 3);
        
        this.writer
            .string(RecordType.ADR, 3)
            .string(name[0], 30)
            .string(name[1], 30)
            .string(name[2], 30)
            .string(street, 30)
            .string(country, 3)
            .string(postalCode, 6)
            .string(city, 30)
            .nl();
        
        return this;
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.4 Satzart POA
     */
    poa(data : IPoa) : this {
        this.check();
        
        let {
            positionCraftsman = this.mode === Mode.Craftsman ? ++this.runningPosition : 0,
            positionWholesale = this.mode === Mode.Wholesale ? ++this.runningPosition : 0,
            articleNumber,
            quantity = 1,
            name = [ '', '' ],
            gross,
            priceUnit = '',
            net,
            discount = [ 0, 0 ],
            index = ++this.runningIndex,
            alternative,
            type = PositionType.Regular,
            reservation,
            quantityUnit = 'Stk',
            pkz = '',
            storeType = '',
        } = data;
        
        if(net === undefined) {
            net = gross * quantity;
        }
        
        name = this.scalarToArray(name, '', 2);
        discount = this.scalarToArray(discount, 0, 2);
        
        this.writer
            .string(RecordType.POA, 3)
            .int(positionCraftsman, 10)
            .int(positionWholesale, 10)
            .string(articleNumber, 15)
            .float(quantity, 11, 3)
            .string(name[0], 40)
            .string(name[1], 40)
            .float(gross, 11, 2)
            .string(priceUnit, 1)
            .float(net, 11, 2)
            .float(discount[0], 5, 2)
            .float(discount[1], 5, 2)
            .int(index, 18)
            .string(alternative ? 'A' : '', 1)
            .string(type, 1)
            .string(reservation ? 'J' : 'N', 1)
            .string(quantityUnit, 3)
            .string(pkz, 1)
            .string(storeType, 1)
            .nl();
        
        return this;
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.5 Satzart POT
     */
    pot(data : IPot) : this {
        this.check();
        
        let {
            positionCraftsman = this.mode === Mode.Craftsman ? ++this.runningPosition : 0,
            positionWholesale = this.mode === Mode.Wholesale ? ++this.runningPosition : 0,
            text,
            index = ++this.runningIndex,
        } = data;
        
        text = this.scalarToArray(text, '', 3);
        
        this.writer
            .string(RecordType.POT, 3)
            .int(positionCraftsman, 10)
            .int(positionWholesale, 10)
            .string(text[0], 40)
            .string(text[1], 40)
            .string(text[2], 40)
            .int(index, 18)
            .nl();
        
        return this;
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.6 Satzart POZ
     */
    poz(data : IPoz) : this {
        this.check();
        
        let {
            positionCraftsman = this.mode === Mode.Craftsman ? ++this.runningPosition : 0,
            positionWholesale = this.mode === Mode.Wholesale ? ++this.runningPosition : 0,
            type,
            description = '',
            dayRate = 0,
            net
        } = data;
        
        if(!/^(\d{2}|[A-Z]{2})$/.test(type)) {
            throw new Error(`Invalid type "${type}"`)
        }
        
        if(type === '99' && !description) {
            throw new Error(`Field "description" is required for type "99"`);
        }
        
        this.writer
            .string(RecordType.POZ, 3)
            .int(positionCraftsman, 10)
            .int(positionWholesale, 10)
            .string(type, 2)
            .string(description, 80)
            .float(dayRate, 11, 2)
            .float(net, 11, 2)
            .nl()
        
        return this;
    }
    
    /**
     * @see http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf 3.7 Satzart END
     */
    end(data : IEnd = {}) : this {
        this.check();
        
        let text = this.scalarToArray(data.text, '', 4);
        
        this.writer
            .string(RecordType.END, 3)
            .string(text[0], 40)
            .string(text[1], 40)
            .string(text[2], 40)
            .string(text[3], 40);
        
        this.wroteEnd = true;
        return this;
    }
    
    protected scalarToArray<T>(input: T|T[]|undefined|null, defaultValue : T, length : number) : T[] {
        let arr : T[];
        if(!Array.isArray(input)) {
            arr = input != undefined ? [ input ] : [];
        } else {
            arr = input.slice();
        }
        while(arr.length < length) {
            arr.push(defaultValue);
        }
        
        return arr;
    }
    
    protected check() {
        if(!this.wroteKop) {
            throw new Error(`Required KOP`);
        }
        if(this.wroteEnd) {
            throw new Error('END already written');
        }
    }
    
    getWriter() : T {
        return this.writer;
    }
}
