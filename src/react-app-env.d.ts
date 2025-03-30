/// <reference types="react-scripts" />

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.mdx" {
  import { ReactNode } from "react";
  const MDXComponent: (props: any) => ReactNode;
  export default MDXComponent;
}

declare module "react-tweet" {
  import { ReactNode } from "react";

  export interface TweetProps {
    id: string;
    [key: string]: any;
  }

  export const Tweet: React.FC<TweetProps>;
  export const TweetSkeleton: React.FC;
  export const TweetNotFound: React.FC;
}
