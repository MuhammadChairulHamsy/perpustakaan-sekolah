import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";

export function SignupForm({
  name,
  email,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  loading,
  error,
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8 border-r">
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
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={onNameChange}
                  placeholder="John Doe"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={onEmailChange}
                  placeholder="m@example.com"
                  required
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={onPasswordChange}
                      placeholder="••••••••"
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={onConfirmPasswordChange}
                      placeholder="••••••••"
                      required
                    />
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
              src="/image/image-register.png"
              alt="Image Illustration"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}