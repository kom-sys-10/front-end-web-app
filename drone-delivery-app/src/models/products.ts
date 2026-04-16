class Product {
    private pid: number;
    private name: string;
    private price: number;
    private description: string;

    public constructor(pid: number ,name: string, price: number, description: string) {
        this.pid = pid;
        this.name = name;
        this.price = price;
        this.description = description
    }

    public getPid(): number {
        return this.pid;
    }

    public getName(): string {
        return this.name;
    }

    public getPrice(): number {
        return this.price;
    }

    public getDescription() {
        return this.description;
    }
    
    public toJson() {
        return {
            pid: this.pid,
            name: this.name,
            price: this.price,
            description: this.description
        };
    }

    public static fromJSON(json: any): Product {
        return new Product(json.pid, json.name, json.price, json.description);
    }
}

export default Product