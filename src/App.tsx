import {
  Card,
  Checkbox,
  CssBaseline,
  Input,
  Row,
  Text,
  Tooltip,
  useClipboard,
  useToasts,
  ZeitProvider,
} from "@zeit-ui/react";
import * as React from "react";
import "./styles.css";
import { getVariant, normals, variants } from "./variants";

export default function App() {
  const [value, setValue] = React.useState("");
  const [copyMode, setCopyMode] = React.useState<"UTF-16" | "UTF-32">("UTF-32");
  const chars = React.useMemo(() => getChars(value), [value]);

  return (
    <ZeitProvider>
      <CssBaseline>
        <Row style={{ width: "100%" }} justify="center">
          <div
            style={{
              maxWidth: 600,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              maxHeight: "100vh",
              padding: 8,
            }}
          >
            <div className="head">
              <Text
                h1
                style={{
                  marginRight: 24,
                  textDecoration: "underline",
                }}
              >
                UniFont
              </Text>
              <Input
                placeholder="a-z, A-Z, 0-9"
                value={value}
                style={{}}
                size="large"
                width="100%"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
                }
                autoFocus
              ></Input>
            </div>
            {/* <Card shadow>
              <Spacer />
              {value && (
              <Description
                title="Your input(hover to inspect unicode)"
                content={
                  <Text h4>
                    <Unicode raw={value} />
                  </Text>
                }
              />
            )}
            </Card> */}
            {value && (
              <>
                <Row
                  style={{ margin: 8 }}
                  align="middle"
                  justify="space-between"
                  gap={0.8}
                >
                  <Text small>Tap to copy</Text>
                  <Checkbox
                    value={copyMode === "UTF-16"}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setCopyMode(e.target.checked ? "UTF-16" : "UTF-32")
                    }
                  >
                    Copy as UTF-16
                  </Checkbox>
                </Row>
                <Card shadow style={{ flex: 1, overflow: "scroll" }}>
                  {variants.map((variant) => {
                    const transformed = formatInVariant(
                      chars,
                      getVariant(variant)
                    );
                    return (
                      <CopyContainer
                        content={transformed}
                        hint={`${transformed} is copied!`}
                      >
                        <div key={variant} className="variant">
                          <Text span size={24}>
                            {transformed}
                          </Text>
                          <Text small type="secondary">
                            {variant}
                          </Text>
                        </div>
                      </CopyContainer>
                    );
                  })}
                </Card>
              </>
            )}
          </div>
        </Row>
      </CssBaseline>
    </ZeitProvider>
  );
}

function CopyContainer({
  content,
  children,
  hint = `Copied to clipboard!`,
}: React.PropsWithChildren<{ content: string; hint?: React.ReactNode }>) {
  const { copy: copyToClipboard } = useClipboard();
  const [, setToast] = useToasts();
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        copyToClipboard(content);
        setToast({ text: hint });
      }}
    >
      {children}
    </div>
  );
}

function formatInVariant(input: string[], variant: string[]) {
  return input
    .map((char) => {
      const index = normals.indexOf(char);
      if (index === -1) return char;
      return variant[index];
    })
    .join("");
}

function getSurrogatePair(astralCodePoint: number) {
  let highSurrogate = Math.floor((astralCodePoint - 0x10000) / 0x400) + 0xd800;
  let lowSurrogate = ((astralCodePoint - 0x10000) % 0x400) + 0xdc00;
  return [highSurrogate, lowSurrogate];
}

function getAstralCodePoint(highSurrogate: number, lowSurrogate: number) {
  return (highSurrogate - 0xd800) * 0x400 + lowSurrogate - 0xdc00 + 0x10000;
}

function Unicode({ raw }: { raw: string }) {
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

function formatUTF(char: string): string | undefined {
  return char.length === 1
    ? format(char.codePointAt(0) || 0)
    : `${format(char.codePointAt(0) || 0)}(${char
        .split("")
        .map((char) => getUnicode(char))
        .join("")})`;
}

function getChars(raw: string) {
  const content = [];
  // using `for` here as String.prototype[@@iterator] is unicode-aware
  for (const char of raw) {
    content.push(char);
  }
  return content;
}

function getUnicode(raw: string) {
  return format(raw.charCodeAt(0));
}

function format(value: number) {
  return `\\u${value.toString(16).padStart(4, "0")}`;
}
