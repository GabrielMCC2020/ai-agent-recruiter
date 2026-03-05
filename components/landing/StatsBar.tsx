const stats = [
  { value: "10x", label: "Faster Screening", color: "text-violet-400" },
  { value: "500+", label: "Calls Per Day", color: "text-indigo-400" },
  { value: "95%", label: "Screening Accuracy", color: "text-emerald-400" },
  { value: "60%", label: "Cost Reduction", color: "text-sky-400" },
  { value: "24/7", label: "Always Available", color: "text-purple-400" },
];

export default function StatsBar() {
  return (
    <section className="bg-[#0d1224] border-y border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className={`text-4xl font-extrabold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-slate-400">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
