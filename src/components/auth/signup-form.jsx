import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

export function SignupForm({
  register,
  handleSubmit,
  onSubmit,
  errors = {},
  loading,
  error,
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate 
            className="bg-background p-6 md:p-8 border-r"
          >
            <FieldGroup>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl text-foreground font-display font-bold">
                  Buat Akun
                </h1>
                <p className="text-muted-foreground text-balance font-body">
                  Daftar untuk menggunakan perpustakaan sekolah
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
                <Input id="name" {...register("name")} placeholder="John Doe" />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </Field>
                </Field>
              </Field>
              <Field>
                <Button
                  type="submit"
                  className="cursor-pointer hover:"
                  disabled={loading}
                >
                  {loading ? "Membuat akun..." : "Buat akun"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Sudah punya akun? {""}
                <Link
                  to={"/login"}
                  className="text-foreground hover:text-chart-2 font-medium"
                >
                  Masuk di sini
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-background border-r relative hidden md:block dark:bg-accent-foreground">
            <img
              src="/image/register.png"
              alt="Image Illustration"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
