import { Request, Response } from "express";
import { Redis } from "ioredis";

export type MyContext = {
  req: Request & { session: Express.Session };
  redis: Redis;
  res: Response;
};
