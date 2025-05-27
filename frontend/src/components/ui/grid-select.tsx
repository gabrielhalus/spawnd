import * as React from "react";

import { cn } from "@/lib/utils";

import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { Check } from "lucide-react";

export type GridSelectOption<T = string> = {
  label: string;
  value: T;
  description?: string;
};

type GridSelectProps<T = string> = {
  options: GridSelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  cols?: number;
  name?: string;
  disabled?: boolean;
  className?: string;
};

function GridSelect<T = string>({
  options,
  value,
  onChange,
  cols = 3,
  name,
  disabled = false,
  className,
}: GridSelectProps<T>) {
  const [internalValue, setInternalValue] = React.useState<T | undefined>(
    value,
  );

  const handleSelect = (val: T) => {
    setInternalValue(val);
    onChange?.(val);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {name && value != null && (
        <input type="hidden" name={name} value={String(value)} />
      )}

      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {options.map((opt) => {
          const isSelected = opt.value === internalValue;
          return (
            <Card
              key={String(opt.value)}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "relative cursor-pointer transition",
                isSelected ? "border-primary" : "hover:shadow-sm",
                disabled && "opacity-50 pointer-events-none",
              )}
            >
              <CardHeader>
                <CardTitle>{opt.label}</CardTitle>
                <CardDescription>{opt.description}</CardDescription>
              </CardHeader>
              {isSelected && (
                <span className="absolute right-2 bottom-2 h-5 w-5 rounded-full bg-primary grid place-items-center transition">
                  <Check className="text-primary-foreground h-3 w-3 stroke-3" />
                </span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export { GridSelect };
