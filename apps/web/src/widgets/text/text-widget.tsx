import Markdown from "react-markdown";
import type { WidgetComponentProps } from "../types";

const MARKDOWN_STYLES = [
  "space-y-2 text-sm",
  "[&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold",
  "[&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold",
  "[&_h4]:font-semibold",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
].join(" ");

const HEADING_LEVELS = { h1: "h2", h2: "h3", h3: "h4", h4: "h5", h5: "h6" } as const;

export function TextWidget({ props }: WidgetComponentProps) {
  return (
    <div className={MARKDOWN_STYLES}>
      <Markdown skipHtml components={HEADING_LEVELS}>
        {readContent(props.content)}
      </Markdown>
    </div>
  );
}

function readContent(content: unknown) {
  if (typeof content === "string") return content;
  return JSON.stringify(content) ?? "";
}
