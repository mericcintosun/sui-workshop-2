import { z } from "zod";

const envSchema = z.object({
  SUI_NETWORK: z.string().default("testnet"),
  USER_SECRET_KEY: z.string().optional(),
  PACKAGE_ID: z
    .string()
    .default(
      "0x4a784d446b257301a6a255c36b7ccaff3a079c3ca31c08ad9461a8707df009a8"
    ),
  MINTADDRESSES_ID: z
    .string()
    .default(
      "0xe93ed783e29cd4bc0bad46528ce6eb4b30d09686331aaf32fa74a739050def1a"
    ),
});

export const ENV = envSchema.parse({
  SUI_NETWORK: process.env.SUI_NETWORK,
  USER_SECRET_KEY: process.env.USER_SECRET_KEY,
  PACKAGE_ID: process.env.PACKAGE_ID,
  MINTADDRESSES_ID: process.env.MINTADDRESSES_ID,
});
