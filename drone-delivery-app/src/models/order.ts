// Order model: represents a placed order. droneId is optional until a drone is assigned by the backend.
class Order {
    private oid?: number;
    private uid: number;
    private date: string;
    private status: string;
    private packageWeight: number;
    private shipmentType: string;
    private address: string;
    private deliveryDate: string;
    private paymentNumber: string;
    private pids: number[];
    private droneId?: number;
    private droneInMaintenance: boolean;

    public constructor(
        oid: number | undefined,
        uid: number,
        date: string,
        status: string,
        packageWeight: number,
        shipmentType: string,
        address: string,
        deliveryDate: string,
        paymentNumber: string,
        pids: number[],
        droneId?: number,
        droneInMaintenance: boolean = false
    ) {
        this.oid = oid;
        this.uid = uid;
        this.date = date;
        this.status = status;
        this.packageWeight = packageWeight;
        this.shipmentType = shipmentType;
        this.address = address;
        this.deliveryDate = deliveryDate;
        this.paymentNumber = paymentNumber;
        this.pids = pids;
        this.droneId = droneId;
        this.droneInMaintenance = droneInMaintenance;
    }

    public getOid(): number | undefined {
        return this.oid;
    }

    public getDate(): string {
        return this.date;
    }

    public getStatus(): string {
        return this.status;
    }

    public getPackageWeight(): number {
        return this.packageWeight;
    }

    public getShipmentType(): string {
        return this.shipmentType;
    }

    public getAddress(): string {
        return this.address;
    }

    public getDeliveryDate(): string {
        return this.deliveryDate;
    }

    public getPaymentNumber(): string {
        return this.paymentNumber;
    }

    public getPids(): number[] {
        return this.pids;
    }

    public getDroneId(): number | undefined {
        return this.droneId;
    }

    public getDroneInMaintenance(): boolean {
        return this.droneInMaintenance;
    }

    // droneInMaintenance is excluded because it is a server-managed field, not sent on creation.
    public toJSON() {
        return {
            uid: this.uid,
            date: this.date,
            status: this.status,
            packageWeight: this.packageWeight,
            shipmentType: this.shipmentType,
            address: this.address,
            deliveryDate: this.deliveryDate,
            paymentNumber: this.paymentNumber,
            pids: this.pids,
            droneId: this.droneId
        };
    }

    public static fromJSON(json: any): Order {
        return new Order(
            json.oid,
            json.uid,
            json.date,
            json.status,
            json.packageWeight,
            json.shipmentType,
            json.address,
            json.deliveryDate,
            json.paymentNumber,
            json.pids,
            json.droneId,
            json.droneInMaintenance ?? false 
        );
    }
}

export default Order;