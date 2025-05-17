import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { type LoginSchema, loginSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { SignInResponse, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const Login = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password",
  );
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginSchema) => {
    const { email, password } = data;
    setLoading(true);

    const response: SignInResponse | undefined = await signIn<"credentials">(
      "credentials",
      {
        email: email,
        password: password,
        redirect: false,
        loading: false,
      },
    );

    if (response?.ok === false || null) {
      toast({
        title: "Şifre yanlış!",
        description: "Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      setLoading(false);

      return;
    } else {
      toast({
        title: "Giriş yapıldı!",
        description: "Hoşgeldiniz.",
        variant: "success",
      });
      setLoading(false);

      return router.push("/dashboard");
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full sm:w-[500px]">
        <CardHeader>
          <CardTitle>Giriş Yap</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)}>
            <CardContent className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="johndoe@gmail.com" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordType}
                          placeholder="********"
                          {...field}
                        />
                        {passwordType === "password" ? (
                          <Eye
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setPasswordType("text")}
                          />
                        ) : (
                          <EyeOff
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setPasswordType("password")}
                          />
                        )}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="purple"
                disabled={loading}
                type="submit"
              >
                Giriş Yap
              </Button>
            </CardFooter>
          </form>
        </Form>
        <p className="flex justify-center gap-2 pb-6 text-sm">
          Hesabınız yok mu?{" "}
          <Link
            href="/register"
            className="text-purple transition-colors hover:text-purple/75"
            onClick={() => router.push("/register")}
          >
            Kayıt Ol
          </Link>
        </p>
      </Card>
    </MaxWidthWrapper>
  );
};

export default Login;
