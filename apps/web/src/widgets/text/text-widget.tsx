import Markdown from "react-markdown";
import type { WidgetComponentProps } from "../types";

const MARKDOWN_STYLES = [
  "space-y-2 text-sm",
  "[&_h1]:font-display [&_h1]:text-xl [&_h1]:font-semibold",
  "[&_h2]:font-display [&_h2]:text-base [&_h2]:font-semibold",
  "[&_h3]:font-semibold",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
].join(" ");

export function TextWidget({ props }: WidgetComponentProps) {
  return (
    <div className={MARKDOWN_STYLES}>
      <Markdown skipHtml>{readContent(props.content)}</Markdown>
    </div>
  );
}

function readContent(content: unknown) {
  if (typeof content === "string") return content;
  return JSON.stringify(content) ?? "";
}
