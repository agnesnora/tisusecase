import data from "./db 1.json";

import { createClient } from "@supabase/supabase-js";

import { MeterSchema } from "./src/schemas/meters";
import { ReadingSchema } from "./src/schemas/readings";

// --- Konfiguráció ---
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// A mock JSON adataid (bemásolva vagy importálva)
// Fontos: a mock JSONban a hónapok stringek, a Zod enum pedig ezt várja, így az valid lesz.
const mockJsonData = data;

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
    .filter((m): m is NonNullable<typeof m> => m !== null);

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
        return null;
      }
      return result.data;
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

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
