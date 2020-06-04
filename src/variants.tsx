import { table } from "./table";

const nameMap = {
  SerifNormal: 0,
  SerifBold: 1,
  SerifItalic: 2,
  SerifBoldItalic: 3,
  SansSerifNormal: 4,
  SansSerifBold: 5,
  SansSerifItalic: 6,
  SansSerifBoldItalic: 7,
  ScriptNormal: 8,
  ScriptBold: 9,
  FrakturNormal: 10,
  FrakturBold: 11,
  MonoSpaceNormal: 12,
  DoubleStruckBold: 13
};

type Variant = keyof typeof nameMap;

const variantMap: string[][] = [];
const toNormal: {
  [input: string]: string;
} = {};
const normalToVariants: {
  [input: string]: string[];
} = {};

export const normals: string[] = [];

table.split("\n").forEach(line => {
  const variantsOfChar = line.split("	");
  const [charNormal] = variantsOfChar;
  normals.push(charNormal);
  normalToVariants[charNormal] = variantsOfChar;
  variantsOfChar.forEach((variant, i) => {
    toNormal[variant] = charNormal;
    if (!variantMap[i]) variantMap[i] = [];
    const slot = variantMap[i];
    if (slot) slot.push(variant);
  });
});
export function getVariant(variant: string) {
  return variantMap[nameMap[variant as Variant]];
}

export const variants = Object.keys(nameMap);
