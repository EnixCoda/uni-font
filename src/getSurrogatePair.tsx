import { Tooltip } from "@zeit-ui/react";
import * as React from "react";

export function getChars(raw: string) {
  const content = [];
  // using `for` here as String.prototype[@@iterator] is unicode-aware
  for (const char of raw) {
    content.push(char);
  }
  return content;
}

export function getSurrogatePair(astralCodePoint: number) {
  let highSurrogate = Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xd800;
  let lowSurrogate = ((astralCodePoint - 0x10000) % 0x400) + 0xdc00;
  return [highSurrogate, lowSurrogate];
}

export function getAstralCodePoint(
  highSurrogate: number,
  lowSurrogate: number
) {
  return (highSurrogate - 0xd800) * 0x400 + lowSurrogate - 0xdc00 + 0x10000;
}

export function Unicode({ raw }: { raw: string }) {
  const content = getChars(raw);
  return (
    <>
      {content.map((char, index) => (
        <Tooltip key={index} text={`${char}: ${formatUTF(char)}`}>
          {char}
        </Tooltip>
      ))}
    </>
  );
}

export function formatUTF(char: string): string | undefined {
  return char.length === 1
    ? format(char.codePointAt(0) || 0)
    : `${format(char.codePointAt(0) || 0)}(${char
        .split("")
        .map((char) => getUnicode(char))
        .join("")})`;
}

function getUnicode(raw: string) {
  return format(raw.charCodeAt(0));
}

function format(value: number) {
  return `\\u${value.toString(16).padStart(4, "0")}`;
}
