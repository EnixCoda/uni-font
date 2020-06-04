import * as React from "react";
import "./styles.css";
import {
  CssBaseline,
  Button,
  Text,
  Input,
  Spacer,
  Tooltip,
  Card,
  Table,
  Row
} from "@zeit-ui/react";
import { Check, Copy } from "@zeit-ui/react-icons";
import { variants, getVariant, normals } from "./variants";

export default function App() {
  const [value, setValue] = React.useState("");
  const chars = React.useMemo(() => getChars(value), [value]);

  return (
    <CssBaseline>
      <Row style={{ width: "100%" }} justify="center">
        <div
          style={{
            maxWidth: 600,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            maxHeight: "100vh"
          }}
        >
          <Text h1>UniFont</Text>
          <Card shadow>
            <Input
              placeholder="a-z, A-Z, 0-9"
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
            >
              Original text
            </Input>
            {/* <Spacer /> */}
            {/* {value && (
              <Description
                title="Your input(hover to inspect unicode)"
                content={
                  <Text h4>
                    <Unicode raw={value} />
                  </Text>
                }
              />
            )} */}
          </Card>
          <Spacer />
          {value && (
            <Card shadow style={{ flex: 1, overflow: "scroll" }}>
              <Table
                data={variants.map(variant => {
                  const transformed = formatInVariant(
                    chars,
                    getVariant(variant)
                  );
                  return {
                    variant,
                    preview: (
                      <Tooltip text={variant}>
                        <Text size={20}>{transformed}</Text>
                      </Tooltip>
                    ),
                    action: <CopyButton content={transformed} />
                  };
                })}
              >
                <Table.Column label="Preview" prop="preview" />
                <Table.Column width={120} label="Action" prop="action" />
              </Table>
            </Card>
          )}
        </div>
      </Row>
    </CssBaseline>
  );
}

function CopyButton({ content }: { content: string }) {
  const [icon, setIcon] = React.useState(() => <Copy />);
  return (
    <Button
      icon={icon}
      onClick={() => {
        copyToClipboard(content);
        setIcon(<Check />);
        setTimeout(() => {
          setIcon(<Copy />);
        }, 500);
      }}
      auto
      size="small"
    >
      Copy
    </Button>
  );
}

function copyToClipboard(content: string) {
  const el = document.createElement("textarea");
  el.value = content;

  el.style.position = "fixed";
  el.style.top = "100%";
  el.style.left = "100%";
  document.body.appendChild(el);

  el.select();
  document.execCommand("copy");

  document.body.removeChild(el);
}

function formatInVariant(input: string[], variant: string[]) {
  return input
    .map(char => {
      const index = normals.indexOf(char);
      if (index === -1) return char;
      return variant[index];
    })
    .join("");
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
        .map(char => getUnicode(char))
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
