import { type userPrivateMetadataSchema } from "@/lib/validations/auth";
import { type HandleOAuthCallbackParams } from "@clerk/types";
import { type z } from "zod";

export type UserRole = z.infer<typeof userPrivateMetadataSchema.shape.role>;

export type SSOCallbackPageProps = {
  searchParams: HandleOAuthCallbackParams;
};
