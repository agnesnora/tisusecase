import { createClient } from "@supabase/supabase-js";
import { MeterSchema } from "./src/schemas/meters.js";
import { ReadingSchema } from "./src/schemas/readings.js";
import { readFileSync } from "fs";

// --- Konfiguráció ---
const SUPABASE_URL = "https://hftetqnllzmgvgpsoeix.supabase.co";
const SUPABASE_SERVICE_KEY = "sb_publishable_-Mo-4N8V5o4gLPi6X8ZeJQ_cKZcQOwR";
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// A mock JSON adataid manuális betöltése
const jsonData = readFileSync("./db 1.json", "utf-8");
const mockJsonData = JSON.parse(jsonData);

async function migrate() {
  console.log("Adattisztítás és migráció indítása...");

  // 1. Meters validálása és feltöltése
  // A Zod schema vár egy "location" objektumot, ami a mock JSON-ban ott van.
  const validMeters = mockJsonData.meters
    .map((m, index) => {
      const result = MeterSchema.safeParse(m);
      if (!result.success) {
        console.warn(
          `[${index}] Meter validációs hiba:`,
          result.error.flatten(),
        );
        return null;
      }
      return result.data;
    })
    .filter((m) => m !== null);

  // Adatbázis formátumra alakítás (location -> lat/lon)
  const dbMeters = validMeters.map((m) => ({
    id: m.id,
    label: m.label,
    type: m.type, // Az enum egyezik
    unit: m.unit, // Az enum egyezik
    location_lat: m.location.lat,
    location_lon: m.location.lon,
  }));

  const { error: meterError } = await supabase.from("meters").insert(dbMeters);
  if (meterError) console.error("Meter insert hiba:", meterError);
  else console.log(`✅ ${dbMeters.length} db Meter feltöltve.`);

  // 2. Readings validálása és feltöltése
  const validReadings = mockJsonData.readings
    .map((r, index) => {
      const result = ReadingSchema.safeParse(r);
      if (!result.success) {
        console.warn(
          `[${index}] Reading validációs hiba:`,
          result.error.flatten(),
        );
        return null;
      }
      return result.data;
    })
    .filter((r) => r !== null);

  const dbReadings = validReadings.map((r) => ({
    id: r.id,
    meter_id: r.meterId, // camelCase -> snake_case
    month: r.month,
    year: r.year,
    value: r.value,
  }));

  // Chunkolt feltöltés
  const chunkSize = 100;
  for (let i = 0; i < dbReadings.length; i += chunkSize) {
    const chunk = dbReadings.slice(i, i + chunkSize);
    const { error } = await supabase.from("readings").insert(chunk);
    if (error) console.error(`Reading hiba ${i}-nál:`, error);
  }

  console.log(`✅ ${dbReadings.length} db Reading feltöltve.`);
}

migrate();
