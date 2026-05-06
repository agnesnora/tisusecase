import rawDb from "../../db 1.json";
import { ReadingType } from "@/schemas/readings";

export const readingsStore: ReadingType[] = rawDb.readings as ReadingType[];
