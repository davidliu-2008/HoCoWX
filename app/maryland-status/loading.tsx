export default function LoadingMarylandStatus() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-white px-5 py-10 sm:px-8 lg:px-12">
      <h1 className="text-3xl font-bold text-ink">Maryland School Status</h1>
      <p role="status" className="mt-3 text-slate-600">Loading district status reports…</p>
    </main>
  );
}
