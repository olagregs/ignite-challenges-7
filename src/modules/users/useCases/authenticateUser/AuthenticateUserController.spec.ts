import { Connection, createConnection } from "typeorm";
import request from 'supertest';

import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate a user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "123@test"
    });

    expect(response.body.user).toHaveProperty("id");
    expect(response.body.token);
  });

  it("Should not be able to authenticate user with wrong email", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "wrongmail@test.com",
      password: "123@test"
    });

    expect(response.status).toBe(401);
  });

  it("Should not be able to authenticate user with wrong password", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const response = await request(app).post("/api/v1/sessions").send({
      email: "user@test.com",
      password: "wrongpassword@test"
    });

    expect(response.status).toBe(401);
  })
});