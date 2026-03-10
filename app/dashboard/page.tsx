export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-sidebar-border bg-card p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome to your RecruitAI dashboard. Navigate through the sidebar to access different features.
        </p>
      </div>
      
      {/* Placeholder for future dashboard content */}
      <div className="grid grid-cols-2 grid-rows-2 grid-flow-col gap-4">
        {[
          { title: "Total Jobs", value: "12", description: "Active job postings" },
          { title: "Candidates", value: "156", description: "Total candidates" },
          { title: "Interviews", value: "24", description: "Scheduled this week" },
          { title: "Hired", value: "8", description: "This month" },
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-sidebar-border bg-card p-6"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


