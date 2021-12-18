export interface UserAddModel {
	name: string;
	email: string;
	password: string;
	type: string;
}

export interface UserViewModel {
	id: number;
	email: string;
	name: string;
	type: string;
}