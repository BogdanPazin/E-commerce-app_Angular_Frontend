export class Product {

    constructor(
        // id ATRIBUT JE DODAT OD STRANE ANGULAR LANGUAGE SERVICE-A
        public id: number,
        public sku: string, 
        public name: string, 
        public description: string,
        public unitPrice: number,
        public imageUrl: string, 
        public active: boolean, 
        public unitsInStock: number,
        public dateCreated: Date, public lastUpdated: Date){

    }

}
