"use strict";
exports.__esModule = true;
exports.MeterSchema = void 0;
var z = require("zod");
exports.MeterSchema = z.object({
    id: z.string(),
    label: z.string().min(1),
    location: z.object({
        lat: z.number(),
        lon: z.number()
    }),
    type: z["enum"](["electricity", "gas"]),
    unit: z["enum"](["kWh", "m3"])
});
