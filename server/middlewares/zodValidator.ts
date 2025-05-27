import type { Context, Next } from "hono";
import { z, type ZodTypeAny } from "zod";

type ValidatorTarget = "json" | "body" | "query" | "param";

export const zValidator = <T extends ValidatorTarget, S extends ZodTypeAny>(
  target: T,
  schema: S,
) => {
  type Output = z.infer<S>;

  return async (ctx: Context, next: Next) => {
    let data: unknown;

    if (target === "json" || target === "body") {
      data = await ctx.req.json();
    } else if (target === "query") {
      data = ctx.req.query();
    } else if (target === "param") {
      data = ctx.req.param();
    } else {
      throw new Error(`Unsupported validation target: ${target}`);
    }

    try {
      const parsed = schema.parse(data);

      // Type-safe .valid() method
      ctx.req.valid = ((key) => {
        if (key === target) return parsed;
        throw new Error(`Validation for "${key}" is not available`);
      }) as <K extends T>(key: K) => Output;

      await next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return ctx.json(
          {
            message: `Validation failed for ${target}`,
            errors: err.flatten(),
          },
          400,
        );
      }

      throw err;
    }
  };
};
