// User model: represents the authenticated user. toJson() omits uid because it is server-assigned.
class User {
    private uid: number;
    private name: string;
    private password: string;

    public constructor(uid: number, name: string, password: string) {
        this.uid = uid;
        this.name = name;
        this.password = password;
    }

    public getName(): string {
        return this.name;
    }

    public getUid(): number {
        return this.uid;
    }

    public toJson() {
        return {
            name: this.name,
            password: this.password
        };
    }

    public static fromJSON(json: any) {
        return new User(json.uid, json.name, json.password);
    }
}

export default User