import { BlogPost } from "../../typings";

const post: BlogPost = {
  id: "2",
  title: "Advanced TypeScript Patterns",
  date: "2024-06-20",
  slug: "advanced-typescript-patterns",
  summary: "Explore powerful TypeScript patterns for better code structure.",
  content: `
# Advanced TypeScript Patterns

TypeScript adds static type definitions to JavaScript, enabling better tooling and error catching. Here are some advanced patterns that can make your TypeScript code more robust.

## Discriminated Unions

\`\`\`typescript
type Success = { 
  kind: 'success'; 
  data: any 
};

type Error = { 
  kind: 'error'; 
  error: string 
};

type Result = Success | Error;

function handleResult(result: Result) {
  if (result.kind === 'success') {
    // TypeScript knows result is Success here
    console.log(result.data);
  } else {
    // TypeScript knows result is Error here
    console.error(result.error);
  }
}
\`\`\`

## Utility Types

TypeScript provides several utility types to facilitate common type transformations:

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Only make some properties required
type UserSummary = Pick<User, 'id' | 'name'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties read-only
type ReadonlyUser = Readonly<User>;
\`\`\`

## Type Guards

\`\`\`typescript
function isString(value: any): value is string {
  return typeof value === 'string';
}

function processValue(value: any) {
  if (isString(value)) {
    // TypeScript knows value is a string here
    return value.toUpperCase();
  }
  return String(value);
}
\`\`\`

These patterns can help you write more type-safe and maintainable TypeScript code.
  `,
  author: "Rohan Sharma",
};

export default post;
