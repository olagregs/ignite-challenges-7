
import { Connection, createConnection } from "typeorm";
import request from "supertest";
import { v4 as uuidV4 } from "uuid";

import { app } from "../../../../app";

let connection: Connection;

describe("Get statement operation", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get statements operation from user's account", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "123@test"
    });

    const { token } = responseToken.body;

    const depositReceipt = await request(app).post("/api/v1/statements/deposit").send({
      amount: 50,
      description: "Deposit test"
    }).set({
      authorization: `Bearer ${token}`
    });

    const { id } = depositReceipt.body;

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });

  it("Should not be able to show an unexistant statement", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "123@test"
    });

    const { token } = responseToken.body;

    const id = uuidV4();

    const response = await request(app).get(`/api/v1/statements/${id}`).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(404);
  });
});