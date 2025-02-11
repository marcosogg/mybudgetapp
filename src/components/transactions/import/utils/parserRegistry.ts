
import { StatementParser } from "./baseParser";
import { RevolutParser } from "../formats/revolut/revolutParser";
import { WiseParser } from "../formats/wise/wiseParser";

export type StatementFormat = "revolut" | "wise";

const parsers: Record<StatementFormat, StatementParser> = {
  revolut: RevolutParser,
  wise: WiseParser,
};

export const getParser = (format: StatementFormat): StatementParser => {
  return parsers[format] || RevolutParser;
};

export const detectFormat = (headers: string[]): StatementFormat => {
  if (WiseParser.validateHeaders(headers)) {
    return "wise";
  }
  return "revolut";
};

export const SUPPORTED_FORMATS = ['revolut', 'wise'] as const;

export const FORMAT_LABELS: Record<StatementFormat, string> = {
  revolut: 'Revolut',
  wise: 'Wise'
};
