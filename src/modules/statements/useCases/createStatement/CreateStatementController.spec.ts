import { Connection, createConnection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new deposit", async () => {
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

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "Deposit test"
    }).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  });

  it("Should be able to create a new withdraw", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "Withdraw test"
    }).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create a new withdraw if the user has insufficient founds", async () => {
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 60,
      description: "Withdraw test"
    }).set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(400);
  });
});