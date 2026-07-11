import HostForm from "@/app/_components/HostForm";

export default function HostPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">List your place</h1>
      <p className="mt-2 text-ink-soft">
        Post your apartment and find a subletter for the summer.
      </p>
      <HostForm />
    </div>
  );
}
