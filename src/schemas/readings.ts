import * as z from "zod";

export const ReadingSchema = z.object({
  id: z.string(),
  meterId: z.string(),
  month: z.enum([
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]),
  year: z.number().int().min(1900).max(2100),
  value: z.number().nonnegative(),
});

export type ReadingType = z.infer<typeof ReadingSchema>;

export type ReadingWithConsumption = ReadingType & {
  consumption: number;
  date: string;
};
