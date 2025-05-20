import MaxWidthWrapper from "@/components/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerSchema, type RegisterSchema } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { api } from "@/utils/api";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [passwordType, setPasswordType] = useState<"password" | "text">(
    "password",
  );
  const [confirmPasswordType, setConfirmPasswordType] = useState<
    "password" | "text"
  >("password");

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = api.auth.registerWithEmailAndPassword.useMutation();

  const handleRegister = async (data: RegisterSchema) => {
    const { name, surname, email, password } = data;

    const result = await registerMutation.mutateAsync({
      name,
      surname,
      email,
      password,
    });

    if (result === true) {
      toast({
        title: "Başarıyla kayıt oldunuz.",
        description: "Giriş yapabilirsiniz.",
        variant: "success",
      });
      void router.push("/login");
    } else if (result === false) {
      toast({
        title: "Bu e-posta adresiyle zaten kayıt oldunuz.",
        description: "Lütfen başka bir e-posta adresi deneyiniz.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bir hata oluştu.",
        description: "Lütfen daha sonra tekrar deneyiniz.",
        variant: "destructive",
      });
    }
  };

  return (
    <MaxWidthWrapper>
      <Card className="w-full sm:w-[500px]">
        <CardHeader>
          <CardTitle>Kayıt Ol</CardTitle>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)}>
            <CardContent className="flex flex-col space-y-4">
              <div className="justify-between space-y-4 sm:flex sm:space-y-0">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ad</FormLabel>
                      <FormControl>
                        <Input placeholder="Ali" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="surname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Soyad</FormLabel>
                      <FormControl>
                        <Input placeholder="Yılmaz" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="aliyilmaz@gmail.com" {...field} />
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre Tekrarı</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={confirmPasswordType}
                          placeholder="********"
                          {...field}
                        />
                        {confirmPasswordType === "password" ? (
                          <Eye
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setConfirmPasswordType("text")}
                          />
                        ) : (
                          <EyeOff
                            size={20}
                            className="absolute right-4 top-2 cursor-pointer bg-background"
                            onClick={() => setConfirmPasswordType("password")}
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
                disabled={registerMutation.isLoading}
                type="submit"
              >
                Kayıt Ol
              </Button>
            </CardFooter>
          </form>
        </Form>
        <p className="flex justify-center gap-2 pb-6 text-sm">
          Zaten bir hesabınız var mı?{" "}
          <Link
            href="/login"
            className="text-purple transition-colors hover:text-purple/75"
          >
            Giriş Yapın.
          </Link>
        </p>
      </Card>
    </MaxWidthWrapper>
  );
};

export default Register;
