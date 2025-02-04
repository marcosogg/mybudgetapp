import { StatementParser } from "./baseParser";
import { RevolutParser } from "../formats/revolut/revolutParser";
import { WiseParser } from "../formats/wise/wiseParser";

export type StatementFormat = "revolut" | "wise";

const parsers: Record<StatementFormat, StatementParser> = {
  revolut: RevolutParser,
  wise: WiseParser,
};

export const getParser = (format: StatementFormat): StatementParser => {
  return parsers[format];
};