import { Connection, createConnection } from "typeorm";
import request from "supertest";

import { app } from "../../../../app";

let connection: Connection;

describe("Show user profile", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to show a user profile", async () => {
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

    const response = await request(app).get("/api/v1/profile").set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(200);
  });

  it("Should not be able to show a non-existant user profile", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "invaliduser@test.com",
      password: "123@test"
    });

    const { token } = responseToken.body;

    const response = await request(app).get("/api/v1/profile").set({
      authorization: `Bearer ${token}`
    });

    expect(response.status).toBe(401);
  });
});