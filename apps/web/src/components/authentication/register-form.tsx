import { registerInputSchema, registerOutputSchema } from "@spawnd/shared/contracts/auth";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { debounceAsync } from "@/lib/debounce";

const checkEmailAvailable = debounceAsync(async (email: string): Promise<string | void> => {
  const res = await fetch(`/api/auth/email-available?email=${encodeURIComponent(email)}`);
  const json = await res.json();

  if (!json.available) {
    return "Email is already taken"
  }
}, 500);

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const form = useForm({
    validators: {
      onChange: registerInputSchema,
    },
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const json = await res.json();

      const parsed = registerOutputSchema.safeParse(json);
      if (!parsed.success) {
        toast.error("Something went wrong");
        return;
      }

      const data = parsed.data;

      if (data.success) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate({ to: "/" });
      } else {
        toast.error(data.error);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome aboard!</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(e);
          }}
          >
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <form.Field
                    name="name"
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Full Name</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="text"
                          placeholder="John Doe"
                          required
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid
                          ? (
                              <p className="text-destructive text-sm">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )
                          : null}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <form.Field
                    name="email"
                    validators={{
                      onChangeAsync: async ({ value }) =>{
                        const error = await checkEmailAvailable(value);
                        return error ? { message: error } : undefined;
                      }
                    }}
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Email</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="email"
                          placeholder="m@example.com"
                          required
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid
                          ? (
                              <p className="text-destructive text-sm">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )
                          : null}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <form.Field
                    name="password"
                    children={field => (
                      <>
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          type="password"
                          required
                        />
                        {field.state.meta.isTouched && !field.state.meta.isValid
                          ? (
                              <p className="text-destructive text-sm">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )
                          : null}
                      </>
                    )}
                  />
                </div>
                <form.Subscribe
                  selector={state => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <>
                      <Button type="submit" disabled={!canSubmit}>
                        {isSubmitting ? "..." : "Sign up"}
                      </Button>
                    </>
                  )}
                />
              </div>
              <div className="text-center text-sm">
                Already have an account?
                {" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
