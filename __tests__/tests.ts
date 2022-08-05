import { api } from "../src/api";
import request from "supertest";

describe("GET / - a simple api endpoint", () => {
  it("Hello API Request", async () => {
    const result = await request(api).get("/");
    expect(result.text).toEqual("hello");
    expect(result.statusCode).toEqual(200);
  });
});
