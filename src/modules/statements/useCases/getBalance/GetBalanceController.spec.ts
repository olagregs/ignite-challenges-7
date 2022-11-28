import { Connection, createConnection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";

let connection: Connection;

describe("Get balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to get balance from user's account", async () => {
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

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 50,
      description: "Deposit test"
    }).set({
      authorization: `Bearer ${token}`
    });

    const response = await request(app).get("/api/v1/statements/balance").set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });
});