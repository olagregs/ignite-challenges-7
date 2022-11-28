import { Connection, createConnection } from 'typeorm';
import request from 'supertest';

import { app } from '../../../../app';

let connection: Connection;

describe("Create user", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    expect(response.status).toBe(201);
  });

  it("Should not be able to create an existant user", async () => {
    await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "User test",
      email: "user@test.com",
      password: "123@test"
    });

    expect(response.status).toBe(400);
  });
});