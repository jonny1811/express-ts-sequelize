export interface UserAddModel {
	name: string;
	email: string;
	password: string;
	type: number;
}

export interface UserViewModel {
	id: number;
	email: string;
	name: string;
	type: number;
}