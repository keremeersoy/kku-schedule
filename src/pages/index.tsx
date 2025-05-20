import MaxWidthWrapper from "@/components/max-width-wrapper";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="space-y-24">
        <section className="py-20 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl md:text-7xl">
            Kırıkkale Üniversitesi Sınav Takvimi Oluşturucu
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Kırıkkale Üniversitesi akademisyenlerinin sınav takvimini yönetmesi için tasarlandı.
          </p>
        </section>
      </MaxWidthWrapper>
    </>
  );
}
