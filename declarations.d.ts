declare module "*.module.scss";

declare module "*.mdx" {
  import React from "react";
  const MDXComponent: React.ComponentType;
  export default MDXComponent;
}
