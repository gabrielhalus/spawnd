import { createFormHook } from "@tanstack/react-form";
import { lazy } from "react";
import {
  fieldContext,
  formContext,
  useFieldContext,
  useFormContext,
} from "./form-context.tsx";
import { Button } from "@/components/ui/button.tsx";

const SelectField = lazy(() =>
  import("@/components/ui/select-field.tsx").then((module) => ({
    default: module.SelectField,
  })),
);

function FieldInfo() {
  const field = useFieldContext();

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className="text-destructive text-sm">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </p>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting]}
      children={([canSubmit, isSubmitting]) => (
        <Button type="submit" disabled={!canSubmit}>
          {isSubmitting ? "..." : label}
        </Button>
      )}
    />
  );
}

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    SelectField,
    FieldInfo,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
