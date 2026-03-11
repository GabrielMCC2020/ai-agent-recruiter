"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddJobDialog } from "@/components/dashboard/add-job-dialog";
import { JobCard } from "@/components/dashboard/job-card";
import { toast } from "sonner";

interface Job {
  id: number;
  title: string;
  department?: string;
  description: string;
  location?: string;
  salaryRange?: string;
  jobType?: string;
  skills?: string[];
  status: string;
  createdAt: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "active" | "expired">("all");

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      const data = await response.json();
      setJobs(data);
      setFilteredJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Failed to load jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Filter by search query
    filtered = filtered.filter((job) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.department?.toLowerCase().includes(searchTerm) ||
        job.location?.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredJobs(filtered);
  }, [searchQuery, jobs, statusFilter]);

  const handleJobDeleted = () => {
    fetchJobs();
  };

  const handleStatusChanged = () => {
    fetchJobs();
  };

  const jobsByStatus = {
    draft: jobs.filter((j) => j.status === "draft").length,
    active: jobs.filter((j) => j.status === "active").length,
    expired: jobs.filter((j) => j.status === "expired").length,
  };

return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
<h1 className="text-3xl font-bold tracking-tight">Empleos</h1>
          <p className="text-muted-foreground mt-1">
            {jobs.length} publicación{jobs.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Empleo
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, descripción, ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {["all", "draft", "active", "expired"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setStatusFilter(status as "all" | "draft" | "active" | "expired")
              }
            >
              {status === "all"
                ? "Todos"
                : status === "draft"
                  ? "Borrador"
                  : status === "active"
                    ? "Activo"
                    : "Expirado"}{" "}
              ({status === "all"
                ? jobs.length
                : status === "draft"
                  ? jobsByStatus.draft
                  : status === "active"
                    ? jobsByStatus.active
                    : jobsByStatus.expired})
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando empleos...</p>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== "all"
              ? "No hay empleos que coincidan con tu búsqueda"
              : "No hay empleos aún. ¡Comienza creando tu primera publicación!"}
          </p>
          {searchQuery === "" && statusFilter === "all" && (
            <Button onClick={() => setDialogOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Empleo
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onDelete={handleJobDeleted}
              onStatusChange={handleStatusChanged}
            />
          ))}
        </div>
      )}

      {/* Add Job Dialog */}
      <AddJobDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onJobAdded={() => {
          fetchJobs();
        }}
      />
    </div>
  );
}
