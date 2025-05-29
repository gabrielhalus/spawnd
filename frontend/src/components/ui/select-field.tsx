import { useFieldContext } from "@/hooks/form-context";

import { cn } from "@/lib/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { Check } from "lucide-react";

export type SelectOption<T = string> = {
  label: string;
  value: T;
  description?: string;
};

export type SelectFieldProps<T = string> = {
  options: SelectOption<T>[];
  label?: string;
  cols?: number;
  disabled?: boolean;
  className?: string;
};

function SelectField<T = string>({
  options,
  label,
  cols = 3,
  disabled = false,
  className,
}: SelectFieldProps<T>) {
  const field = useFieldContext<T>();
  const selectedValue = field.state.value;

  const handleSelect = (val: T) => {
    if (!disabled) {
      field.handleChange(val);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <div className="font-medium">{label}</div>}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {options.map((opt) => {
          const isSelected = opt.value === selectedValue;
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
                <span className="absolute right-1.5 bottom-1.5 h-5 w-5 rounded-full bg-primary grid place-items-center">
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

export { SelectField };
