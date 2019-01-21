/**
 * @jest-environment node
 */

const request = require("supertest");
const app = require("./app");

describe("Test subreddit endpoint", () => {
  test("It should respond with 200 for a valid subreddit", async () => {
    const response = await request(app).get("/api/subreddit/news");
    expect(response.statusCode).toBe(200);
    // expect(response.data[0].title).toBe(
    //   "Scientist Stephen Hawking has died aged 76"
    // );
  });

  test("It should not allow illegal subreddit names and respond with 400", async () => {
    const response = await request(app).get("/api/subreddit/12-3");
    expect(response.statusCode).toBe(400);

    const response2 = await request(app).get(
      "/api/subreddit/asdfasdfasdfasdfasdfasdfasdfasdf"
    );
    expect(response2.statusCode).toBe(400);
  });

  test("It should respond with 404 for nonexistent subreddits", async () => {
    const response = await request(app).get("/api/subreddit/123213");
    expect(response.statusCode).toBe(404);
  });

  test("It should respond with 403 for a private subreddit", async () => {
    const response = await request(app).get("/api/subreddit/test123");
    expect(response.statusCode).toBe(403);
  });

  test("It should respond with 403 for banned subreddit", async () => {
    const response = await request(app).get("/api/subreddit/12345");
    expect(response.statusCode).toBe(403);
  });
});
