"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Search, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddCandidateDialog } from "@/components/dashboard/add-candidate-dialog";
import { CandidateCard } from "@/components/dashboard/candidate-card";
import { CandidateListItem } from "@/components/dashboard/candidate-list-item";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";

interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  experience?: string;
  skills?: string[];
  qualifications?: string;
  status: string;
  createdAt: string;
}

type ViewType = "grid" | "list";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewType, setViewType] = useState<ViewType>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/candidates");
      if (!response.ok) {
        throw new Error("Failed to fetch candidates");
      }
      const data = await response.json();
      setCandidates(data);
      setFilteredCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast.error("Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    const filtered = candidates.filter((candidate) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        `${candidate.firstName} ${candidate.lastName}`
          .toLowerCase()
          .includes(searchTerm) ||
        candidate.email.toLowerCase().includes(searchTerm) ||
        candidate.position?.toLowerCase().includes(searchTerm) ||
        candidate.skills?.some(
          (skill) => skill.toLowerCase().includes(searchTerm)
        )
      );
    });
    setFilteredCandidates(filtered);
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, candidates]);

  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);

  const handleCandidateDeleted = () => {
    fetchCandidates();
  };

  const handleViewChange = (view: ViewType) => {
    setViewType(view);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Candidates</h1>
          <p className="text-muted-foreground mt-1">
            {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, position, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewType === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("grid")}
            className="gap-2"
          >
            <Grid3x3 className="h-4 w-4" />
            Grid
          </Button>
          <Button
            variant={viewType === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange("list")}
            className="gap-2"
          >
            <List className="h-4 w-4" />
            List
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-r-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading candidates...</p>
          </div>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-8 text-center">
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "No candidates match your search"
              : "No candidates yet. Start by adding your first candidate!"}
          </p>
          {!searchQuery && (
            <Button onClick={() => setDialogOpen(true)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Candidate
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewType === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onDelete={handleCandidateDeleted}
                />
              ))}
            </div>
          )}

          {/* List View */}
          {viewType === "list" && (
            <div className="border rounded-lg divide-y">
              {paginatedCandidates.map((candidate) => (
                <CandidateListItem
                  key={candidate.id}
                  candidate={candidate}
                  onDelete={handleCandidateDeleted}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={
                        currentPage === 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Add Candidate Dialog */}
      <AddCandidateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCandidateAdded={() => {
          fetchCandidates();
        }}
      />
    </div>
  );
}
