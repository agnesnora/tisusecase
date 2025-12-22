import * as z from "zod";
import { ReadingType } from "./readings";
export const MeterSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  location: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  type: z.enum(["electricity", "gas"]),
  unit: z.enum(["kWh", "m3"]),
});

export type MeterType = z.infer<typeof MeterSchema>;
export type MeterWithReadingsType = MeterType & {
  latestReading?: ReadingType;
};
