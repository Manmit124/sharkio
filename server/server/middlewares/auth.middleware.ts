import { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { supabaseClient } from "../../lib/supabase-client/supabase-client";
import { useLog } from "../../lib/log";

const cookieKey = process.env.SUPABASE_COOKIE_KEY!;
const log = useLog({
  dirname: __dirname,
  filename: __filename,
});

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  ``;
  try {
    if (
      [/\/sharkio\/api\/login\/email/, /\/api-docs\/.*/, /\/sharkio\/api\/.*/]
        .map((regex) => regex.test(req.path))
        .some((value) => value === true)
    ) {
      next();
      return;
    }

    const authorization = req.headers["authorization"];
    const access_token = authorization?.split(" ")[1];

    const { data: user, error } =
      await supabaseClient.auth.getUser(access_token);

    if (error || !user) {
      log.error(error);
      return res.sendStatus(401);
    } else {
      res.locals.auth = user;
      next();
    }
  } catch (err) {
    log.error(err);
    return res.sendStatus(401);
  }
};