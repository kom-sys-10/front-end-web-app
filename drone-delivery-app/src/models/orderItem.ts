import Product from '../models/products'

class OrderItem {
    private oiid: number;
    private product: Product;

    public constructor(oiid: number, product: Product) {
        this.oiid = oiid;
        this.product = product;
    }

}

export default OrderItem;