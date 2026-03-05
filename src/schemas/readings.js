"use strict";
exports.__esModule = true;
exports.AddReadingSchema = exports.EditSchema = exports.ReadingSchema = exports.months = void 0;
var z = require("zod");
var months = [
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
];
exports.months = months;
exports.ReadingSchema = z.object({
    id: z.string(),
    meterId: z.string(),
    month: z["enum"](months),
    year: z
        .number()
        .int()
        .min(2020)
        .max(new Date().getFullYear() + 1),
    value: z.number().nonnegative()
});
exports.EditSchema = z.object({
    value: z
        .number()
        .positive("Value must be positive")
        .max(5000, "Value seems unrealistically high (max 5000)")
});
exports.AddReadingSchema = z.object({
    month: z["enum"](months),
    year: z.number().int(),
    value: z
        .number()
        .positive("Value must be positive")
        .max(5000, "Value seems unrealistically high (max 5000)")
});
