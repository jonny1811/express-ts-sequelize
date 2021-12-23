export interface ProductAddModel {
    name: string;
    description?: string;
    quantity: number;
    price: number;
}

export interface ProductViewModel extends ProductAddModel {
    id: string;
}
