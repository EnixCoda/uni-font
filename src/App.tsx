import {
  Card,
  CssBaseline,
  Input,
  Row,
  Text,
  useClipboard,
  useToasts,
  ZeitProvider,
} from "@zeit-ui/react";
import * as React from "react";
import { getChars } from "./getSurrogatePair";
import "./styles.css";
import { getVariant, normals, toNormal, variants } from "./variants";

export default function App() {
  const [value, setValue] = React.useState("");
  const parsed = React.useMemo(() => {
    let parsed = "";
    for (const char of value) {
      parsed += toNormal[char] || char;
    }
    return parsed;
  }, [value]);
  const chars = React.useMemo(() => getChars(parsed), [parsed]);

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
              />
            </div>
            {/* <Card shadow>
              <Spacer />
              {parsed && (
              <Description
                title="Your input(hover to inspect unicode)"
                content={
                  <Text h4>
                    <Unicode raw={parsed} />
                  </Text>
                }
              />
            )}
            </Card> */}
            {parsed && (
              <>
                <Row
                  style={{ margin: 8 }}
                  align="middle"
                  justify="space-between"
                  gap={0.8}
                >
                  <Text small>Tap to copy. And paste anywhere with the font reserved.</Text>
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
                        hint={`${
                          transformed.length > 32 ? variant : transformed
                        } is copied!`}
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
                <Row
                  style={{ margin: 8 }}
                  align="middle"
                  justify="center"
                >
                  <Text small>Made by <a href="https://github.com/EnixCoda/">EnixCoda</a></Text>
                </Row>
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
