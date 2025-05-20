import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 flex items-center justify-between border-b-2 bg-background px-12 py-2 text-center">
      <div className="flex items-center space-x-8">
        <Link
          href="/"
          className="mr-12 bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-lg font-bold tracking-wide text-transparent"
        >
          Kırıkkale Üniversitesi | Sınav Takvim
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {!session && (
          <>
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
