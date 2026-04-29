export type TrafficLight = 'green' | 'yellow' | 'red' | 'unknown';

type LabValue = { name: string; value: number; min?: number; max?: number; unit?: string };

const patterns = [
  /(?<name>emoglobina|hb)\s+(?<value>\d+[,.]?\d*)\s*(?<unit>g\/dl)?\s*(?<min>\d+[,.]?\d*)\s*[-–]\s*(?<max>\d+[,.]?\d*)/gi,
  /(?<name>glicemia|glucosio)\s+(?<value>\d+[,.]?\d*)\s*(?<unit>mg\/dl)?\s*(?<min>\d+[,.]?\d*)\s*[-–]\s*(?<max>\d+[,.]?\d*)/gi,
  /(?<name>colesterolo totale)\s+(?<value>\d+[,.]?\d*)\s*(?<unit>mg\/dl)?\s*(?<min>\d+[,.]?\d*)?\s*[-–]?\s*(?<max>\d+[,.]?\d*)?/gi,
  /(?<name>creatinina)\s+(?<value>\d+[,.]?\d*)\s*(?<unit>mg\/dl)?\s*(?<min>\d+[,.]?\d*)\s*[-–]\s*(?<max>\d+[,.]?\d*)/gi,
];

function n(v?: string) { return v ? Number(v.replace(',', '.')) : undefined; }

export function extractLabValues(text: string): LabValue[] {
  const found: LabValue[] = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const g = match.groups || {};
      found.push({ name: g.name, value: n(g.value)!, min: n(g.min), max: n(g.max), unit: g.unit });
    }
  }
  return found;
}

export function calculateTrafficLight(values: LabValue[]): { light: TrafficLight; notes: string[] } {
  if (!values.length) return { light: 'unknown', notes: ['Non sono riuscito a leggere automaticamente valori numerici affidabili dal PDF.'] };
  let red = false;
  let yellow = false;
  const notes: string[] = [];
  for (const v of values) {
    if (v.min == null && v.max == null) continue;
    const below = v.min != null && v.value < v.min;
    const above = v.max != null && v.value > v.max;
    if (below || above) {
      const ref = below ? v.min! : v.max!;
      const deviation = Math.abs(v.value - ref) / Math.max(ref, 1);
      if (deviation > 0.3) red = true; else yellow = true;
      notes.push(`${v.name}: ${v.value}${v.unit ? ' ' + v.unit : ''} fuori dal riferimento ${v.min ?? ''}-${v.max ?? ''}`);
    }
  }
  if (red) return { light: 'red', notes };
  if (yellow) return { light: 'yellow', notes };
  return { light: 'green', notes: ['I valori letti automaticamente risultano compatibili con i riferimenti presenti nel referto.'] };
}

export function lightLabel(light: TrafficLight) {
  return light === 'green' ? 'Verde' : light === 'yellow' ? 'Giallo' : light === 'red' ? 'Rosso' : 'Da verificare';
}
