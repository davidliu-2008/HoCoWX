import type { ReactNode } from "react";

export function PageHero({ title, description, children }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-hero standard-page-hero">
      <div className="page-content text-center">
        <h1>{title}</h1>
        {description && <p className="mx-auto mt-3 max-w-2xl text-base leading-6 sm:text-lg sm:leading-7">{description}</p>}
        {children}
      </div>
    </header>
  );
}
