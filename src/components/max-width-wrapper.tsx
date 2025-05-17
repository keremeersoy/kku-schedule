import { cn } from "@/lib/utils";

const MaxWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "mx-auto flex min-h-screen w-full max-w-screen-xl flex-col items-center justify-center px-2.5 py-3 md:px-20 md:py-24",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
