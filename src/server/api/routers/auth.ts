import { createTRPCRouter, publicProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { z } from "zod";

export const authRouter = createTRPCRouter({
  hello: publicProcedure.query(() => {
    return {
      greeting: `Hello`,
    };
  }),
  registerWithEmailAndPassword: publicProcedure
    .input(
      z.object({
        name: z.string(),
        surname: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }),
    )
    .mutation(async ({ input }) => {
      let user = await db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      if (!user) {
        const newUser = await db.user.create({
          data: {
            name: input.name,
            surname: input.surname,
            email: input.email,
          },
        });

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const hash = await bcrypt.hash(input.password as string, 12);

        await db.account.create({
          data: {
            userId: newUser.id,
            type: "credentials",
            provider: "email",
            password: hash,
          },
        });
      } else {
        const account = await db.account.findFirst({
          where: {
            type: "credentials",
            provider: "email",
            userId: user.id,
          },
        });

        if (account) {
          return false;
        }

        const hash = await bcrypt.hash(input.password, 12);

        await db.account.create({
          data: {
            userId: user.id,
            type: "credentials",
            provider: "email",
            password: hash,
          },
        });
      }

      user = await db.user.findFirst({
        where: {
          email: input.email,
        },
      });

      return true;
    }),
});
