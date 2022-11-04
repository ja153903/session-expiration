import { rest } from "msw";
import { v4 as uuidv4 } from "uuid";

export const handlers = [
  rest.get("/api/get-token", (_req, res, ctx) => {
    const uuid = uuidv4();
    return res(
      ctx.delay(2000),
      ctx.json({
        apiKey: uuid,
      })
    );
  }),
  rest.get("/api/some-expired-token", (_req, res, ctx) => {
    const prob = Math.random();

    if (prob < 0.5) {
      return res(
        ctx.status(403),
        ctx.json({
          error: {
            message: "Token is expired",
          },
        })
      );
    }

    return res(
      ctx.delay(2000),
      ctx.json({
        message: "Super special data coming",
      })
    );
  }),
];
