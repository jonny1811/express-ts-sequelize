import request from 'supertest';
import { Express } from 'express';
import { setupApp } from '../src/config/app';
import { Users } from '../src/db/models';

let app: Express;

describe("test create route", () => {
	beforeAll(async () => {
		app = await setupApp();
	});

	const user = {
		title: "Create user",
	};

	test("Should have key record and msg when created", async () => {
		const mockCreateUser = jest.fn((): any => user);
		jest
			.spyOn(Users, "create")
			.mockImplementation(() => mockCreateUser());

		const res = await request(app).post("/api/create").send(user);

		expect(mockCreateUser).toHaveBeenCalledTimes(1);
		expect(res.body).toHaveProperty("msg");
		expect(res.body).toHaveProperty("record");
	});

	test("Should handle exception", async () => {
		const mockCreateUser = jest.fn((): any => {
			throw "error";
		});
		jest
			.spyOn(Users, "create")
			.mockImplementation(() => mockCreateUser());

		const res = await request(app).post("/api/create").send(user);

		expect(mockCreateUser).toHaveBeenCalledTimes(1);
		expect(res.body).toEqual({
			msg: "fail to create",
			status: 500,
			route: "/create",
		});
	});

	test("Should handle request param", async () => {
		const res = await request(app).post("/api/create").send({});

		expect(res.body).toEqual({
			msg: "The title value should not be empty",
			param: "title",
			location: "body",
		});
	});
});

describe("test read pagination  route", () => {
	const user = {
		title: "Create user",
	};

	test("Should return array of users", async () => {
		const mockReadAllUsers = jest.fn((): any => [user]);
		jest
			.spyOn(Users, "findAll")
			.mockImplementation(() => mockReadAllUsers());

		const res = await request(app).get("/api/read?limit=5");

		expect(mockReadAllUsers).toHaveBeenCalledTimes(1);
		expect(res.body).toEqual([user]);
	});

	test("Should handle exception", async () => {
		const mockCreateUser = jest.fn((): any => {
			throw "error";
		});
		jest
			.spyOn(Users, "findAll")
			.mockImplementation(() => mockCreateUser());

		const res = await request(app).get("/api/read?limit=5");
		expect(mockCreateUser).toHaveBeenCalledTimes(1);
		expect(res.body).toEqual({
			msg: "fail to read",
			status: 500,
			route: "/read",
		});
	});

	test("Should handle request query", async () => {
		const res = await request(app).get("/api/read?limit=0");
		expect(res.body).toEqual({
			value: "0",
			msg: "The limit value should be number and between 1-10",
			param: "limit",
			location: "query",
		});
	});
});
