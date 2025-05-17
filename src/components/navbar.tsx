import Link from "next/link";
import React from "react";

const Navbar = () => {
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
    </div>
  );
};

export default Navbar;
