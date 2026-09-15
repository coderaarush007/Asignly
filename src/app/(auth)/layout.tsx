import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={44}
            height={44}
            className="rounded-[12px]"
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-text">Asignly</h1>
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Focus Desk
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
