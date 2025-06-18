import { Link, useMatches } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Breadcrumbs() {
  const matches = useMatches();

  const items = matches
    .filter(match => match.loaderData?.crumb)
    .map(({ loaderData, ...match }) => ({
      ...match,
      label: loaderData?.crumb,
    }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <BreadcrumbItem key={item.id}>
              {isLast
                ? (
                    <BreadcrumbPage className="line-clamp-1">
                      {item.label}
                    </BreadcrumbPage>
                  )
                : (
                    <>
                      <Link to={item.pathname} params={item.params} className="line-clamp-1 hover:underline">
                        {item.label}
                      </Link>
                      <BreadcrumbSeparator />
                    </>
                  )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
