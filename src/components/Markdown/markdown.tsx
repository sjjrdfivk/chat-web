import { useRef, memo } from "react";
import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";
import { unescape } from "lodash";
import { copyToClipboard } from "../../utils/util";

export const Markdown = memo((props: { content: string; isUser: boolean }) => {
  const isUser = props.isUser;
  const PreCode = (props: { children: any }) => {
    const ref = useRef<HTMLPreElement>(null);
    return (
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText;
              copyToClipboard(code);
            }
          }}
        ></span>
        {props.children}
      </pre>
    );
  };

  let str = unescape(props.content);
  str = str.replace(/\\n/g, "\n");

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeKatex,
          [
            RehypeHighlight,
            {
              detect: false,
              ignoreMissing: true,
            },
          ],
        ]}
        components={
          !isUser
            ? {
                pre: PreCode,
              }
            : undefined
        }
        linkTarget={"_blank"}
      >
        {str}
      </ReactMarkdown>
    </>
  );
});
