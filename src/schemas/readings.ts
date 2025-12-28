import * as z from "zod";

const months = [
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
] as const;

export { months };

export const ReadingSchema = z.object({
  id: z.string(),
  meterId: z.string(),
  month: z.enum(months),
  year: z
    .number()
    .int()
    .min(2020)
    .max(new Date().getFullYear() + 1),
  value: z.number().nonnegative(),
});

export type ReadingType = z.infer<typeof ReadingSchema>;

export type ReadingWithConsumption = ReadingType & {
  consumption: number;
  date: string;
};

export const EditSchema = z.object({
  value: z
    .number()
    .positive("Value must be positive")
    .max(5000, "Value seems unrealistically high (max 5000)"),
});

export const AddReadingSchema = z.object({
  month: z.enum(months),
  year: z.number().int(),

  value: z
    .number()
    .positive("Value must be positive")
    .max(5000, "Value seems unrealistically high (max 5000)"),
});

export type AddReadingType = z.infer<typeof AddReadingSchema>;
export type EditType = z.infer<typeof EditSchema>;
