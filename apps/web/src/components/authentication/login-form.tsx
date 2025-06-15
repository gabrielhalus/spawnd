import { loginInputSchema, loginOutputSchema } from "@spawnd/shared/contracts/auth";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  const form = useForm({
    validators: {
      onChange: loginInputSchema,
    },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(value),
      });

      const responseJson = await res.json();

      const parsed = loginOutputSchema.safeParse(responseJson);
      if (!parsed.success) {
        toast.error("Something went wrong");
        return;
      }

      if (parsed.data.success) {
        localStorage.setItem("accessToken", parsed.data.accessToken);
        navigate({ to: "/" });
      }
      else {
        toast.error(parsed.data.error);
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back!</CardTitle>
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
                    name="email"
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
                        {isSubmitting ? "..." : "Sign in"}
                      </Button>
                    </>
                  )}
                />
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account yet?
                {" "}
                <Link to="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
