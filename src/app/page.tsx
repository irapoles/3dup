import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Image src="/logo.svg" alt="3DUp" width={240} height={100} className="h-16 w-auto object-contain" priority />
    </main>
  );
}
