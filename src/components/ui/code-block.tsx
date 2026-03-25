"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CodeBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  language?: string;
  showLineNumbers?: boolean;
  animate?: boolean;
}

function CodeBlock({
  className,
  title,
  language = "javascript",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showLineNumbers: _showLineNumbers = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  animate: _animate = false,
  children,
  ...props
}: CodeBlockProps) {
  return (
    <div
      className={cn("overflow-hidden rounded-xl border border-white/10 bg-black", className)}
      {...props}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        {title && <span className="text-syntax-slate ml-2 font-mono text-xs">{title}</span>}
        {language && !title && (
          <span className="text-syntax-slate ml-2 font-mono text-xs">{language}</span>
        )}
      </div>

      {/* Code content */}
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}

interface SyntaxLineProps {
  children: React.ReactNode;
  lineNumber?: number;
  delay?: number;
  animate?: boolean;
}

function SyntaxLine({ children, lineNumber, delay = 0, animate = true }: SyntaxLineProps) {
  const content = (
    <div className="flex">
      {lineNumber !== undefined && (
        <span className="text-syntax-slate/50 mr-4 select-none">
          {String(lineNumber).padStart(2, "0")}
        </span>
      )}
      <span>{children}</span>
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {content}
    </motion.div>
  );
}

// Syntax highlighting components
function Comment({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-slate">{children}</span>;
}

function Keyword({ children }: { children: React.ReactNode }) {
  return <span className="text-purple-400">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-400">{children}</span>;
}

function Variable({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-cyan">{children}</span>;
}

function Property({ children }: { children: React.ReactNode }) {
  return <span className="text-blue-400">{children}</span>;
}

function Method({ children }: { children: React.ReactNode }) {
  return <span className="text-amber-400">{children}</span>;
}

function Operator({ children }: { children: React.ReactNode }) {
  return <span className="text-pink-400">{children}</span>;
}

function Punctuation({ children }: { children: React.ReactNode }) {
  return <span className="text-syntax-slate">{children}</span>;
}

// Pre-built code example for the homepage
function SyntaxEngineDemo() {
  return (
    <CodeBlock title="syntax-engine.ts" className="max-w-xl">
      <SyntaxLine lineNumber={1} delay={0}>
        <Comment>{"// The Echodod Engine"}</Comment>
      </SyntaxLine>
      <SyntaxLine lineNumber={2} delay={0.1}>
        <Keyword>if</Keyword>
        <Punctuation>{" ("}</Punctuation>
        <Variable>customer</Variable>
        <Punctuation>.</Punctuation>
        <Property>sentiment</Property>
        <Operator>{" == "}</Operator>
        <Str>{'"urgent"'}</Str>
        <Punctuation>{")"}</Punctuation>
        <Punctuation>{" {"}</Punctuation>
      </SyntaxLine>
      <SyntaxLine lineNumber={3} delay={0.2}>
        {"  "}
        <Variable>route</Variable>
        <Punctuation>.</Punctuation>
        <Property>priority</Property>
        <Operator>{" = "}</Operator>
        <Str>{'"HIGH"'}</Str>
        <Punctuation>;</Punctuation>
      </SyntaxLine>
      <SyntaxLine lineNumber={4} delay={0.3}>
        {"  "}
        <Variable>infrastructure</Variable>
        <Punctuation>.</Punctuation>
        <Method>switchProvider</Method>
        <Punctuation>{"("}</Punctuation>
        <Str>{'"AWS_LATENCY_LOW"'}</Str>
        <Punctuation>{");"}</Punctuation>
      </SyntaxLine>
      <SyntaxLine lineNumber={5} delay={0.4}>
        <Punctuation>{"}"}</Punctuation>
      </SyntaxLine>
    </CodeBlock>
  );
}

export {
  CodeBlock,
  SyntaxLine,
  SyntaxEngineDemo,
  Comment,
  Keyword,
  Str,
  Variable,
  Property,
  Method,
  Operator,
  Punctuation,
};
