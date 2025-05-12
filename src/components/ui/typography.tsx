import * as React from "react"
import { cn } from "@/lib/utils"

export function H1({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h1 className={cn("text-4xl font-bold mt-6 mb-4", className)} {...props} />
}

export function H2({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-3xl font-semibold mt-5 mb-3", className)} {...props} />
}

export function H3({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-2xl font-semibold mt-4 mb-2", className)} {...props} />
}

export function H4({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-xl font-medium mt-3 mb-2", className)} {...props} />
}

export function H5({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn("text-lg font-medium mt-2 mb-2", className)} {...props} />
}

export function H6({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h6 className={cn("text-base font-medium mt-2 mb-1", className)} {...props} />
}

export function P({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mb-4 leading-7 text-base", className)} {...props} />
}

export function UL({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn("list-disc ml-6 mb-4 space-y-2", className)} {...props} />
}

export function OL({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) {
  return <ol className={cn("list-decimal ml-6 mb-4 space-y-2", className)} {...props} />
}

export function LI({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("ml-2", className)} {...props} />
}

export function Blockquote({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) {
  return <blockquote className={cn("pl-4 border-l-4 border-muted italic text-muted-foreground mb-4", className)} {...props} />
}

export function Code({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <code className={cn("bg-muted px-1 rounded font-mono text-sm", className)} {...props} />
}

export function Pre({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return <pre className={cn("bg-muted p-4 rounded overflow-x-auto mb-4 font-mono text-sm", className)} {...props} />
}

export const Typography = {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  P,
  UL,
  OL,
  LI,
  Blockquote,
  Code,
  Pre,
} 