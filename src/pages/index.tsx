import Link from "next/link";
import MaxWidthWrapper from "@/components/max-width-wrapper";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="space-y-24">
        <h1 className="px-12 text-center text-8xl font-bold tracking-wide">kku sınav takvim</h1>
      </MaxWidthWrapper>
    </>
  );
}
