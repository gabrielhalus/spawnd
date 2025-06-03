import type { SelectOption } from "@/components/ui/select-field";
import { useAppForm } from "@/hooks/form";
import { api } from "@shared/hono/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { createServerSchema } from "@shared/schemas/servers";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/create-server")({
  component: CreateServer,
});

async function getServerVersions() {
  const res = await api["server-versions"].$get();
  if (!res.ok) {
    throw new Error("Server error");
  }
  return await res.json();
}

function CreateServer() {
  const navigate = useNavigate();

  const { data, error } = useQuery({
    queryKey: ["get-server-versions"],
    queryFn: getServerVersions,
  });

  if (error) {
    return "An error has occured: " + error.message;
  }

  const form = useAppForm({
    defaultValues: {
      name: "",
      type: "vanilla",
      version: "",
    },
    validators: {
      onChange: createServerSchema,
    },
    onSubmit: async ({ value }) => {
      const parsed = createServerSchema.parse(value);
      const res = await api.servers.$post({ json: parsed });
      if (!res.ok) throw new Error("Server error");
      navigate({ to: "/servers" });
    },
  });

  const parsedData: SelectOption[] =
    data?.mojang.map((v) => ({
      label: v.id,
      value: v.id,
      description: "Minecraft " + v.id,
    })) ?? [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Create a Server</h1>
      <form
        onSubmit={(e) => {
          e.stopPropagation();
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.AppField
          name="name"
          children={(field) => {
            return (
              <>
                <label htmlFor={field.name}>Server Name:</label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <field.FieldInfo />
              </>
            );
          }}
        />

        <form.AppField
          name="type"
          children={(field) => (
            <>
              <field.SelectField
                label="Server Type"
                options={[
                  {
                    label: "Vanilla",
                    value: "vanilla",
                    description: "Default Minecraft Server",
                  },
                ]}
                cols={4}
              />
              <field.FieldInfo />
            </>
          )}
        />

        <form.AppField
          name="version"
          children={(field) => (
            <>
              <field.SelectField
                label="Version"
                options={parsedData}
                cols={4}
              />
              <field.FieldInfo />
            </>
          )}
        />

        <form.AppForm>
          <form.SubscribeButton label="Submit" />
        </form.AppForm>
      </form>
    </div>
  );
}
