import { z } from "zod";

export const verificationSessionStartSchema = z.object({
  provider: z.enum(["hosted", "api"]),
  documentType: z.enum(["passport", "driver_license", "national_id"]),
});

export const signedUploadRequestSchema = z.object({
  entityType: z.enum(["claim", "kyc"]),
  fileName: z.string().min(3).max(128),
  contentType: z.string().min(3).max(128),
  checksum: z.string().min(8).max(256),
});

export type VerificationSessionStartInput = z.infer<
  typeof verificationSessionStartSchema
>;
export type SignedUploadRequestInput = z.infer<
  typeof signedUploadRequestSchema
>;
