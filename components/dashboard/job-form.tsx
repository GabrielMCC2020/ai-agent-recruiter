"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface JobFormProps {
  initialData?: Record<string, any>;
  isSubmitting?: boolean;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}

export function JobForm({
  initialData,
  isSubmitting = false,
  onSubmit,
}: JobFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    department: initialData?.department || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || [],
    responsibilities: initialData?.responsibilities || [],
    location: initialData?.location || "",
    salaryRange: initialData?.salaryRange || "",
    jobType: initialData?.jobType || "full-time",
    skills: initialData?.skills || [],
    yearsOfExperience: initialData?.yearsOfExperience || "",
    qualifications: initialData?.qualifications || "",
    status: initialData?.status || "draft",
  });

  const [newSkill, setNewSkill] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_skill: string, i: number) => i !== index),
    }));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_req: string, i: number) => i !== index),
    }));
  };

  const handleAddResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()],
      }));
      setNewResponsibility("");
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_resp: string, i: number) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
{/* Title */}
      <div>
        <label className="text-sm font-medium">Título del Empleo *</label>
        <Input
          placeholder="ej., Desarrollador React Senior"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      {/* Department and Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Departamento</label>
          <Input
            placeholder="ej., Ingeniería"
            value={formData.department}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, department: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Ubicación</label>
          <Input
            placeholder="ej., Ciudad de México"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Job Type and Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Tipo de Empleo</label>
          <select
            value={formData.jobType}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, jobType: e.target.value }))
            }
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="full-time">Tiempo Completo</option>
            <option value="part-time">Medio Tiempo</option>
            <option value="contract">Contrato</option>
            <option value="remote">Remoto</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Rango Salarial</label>
          <Input
            placeholder="ej., $50,000 - $80,000"
            value={formData.salaryRange}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, salaryRange: e.target.value }))
            }
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium">Descripción *</label>
        <Textarea
          placeholder="Descripción del empleo"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
          rows={4}
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="text-sm font-medium">Requisitos</label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Agregar un requisito"
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRequirement();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRequirement}
            disabled={!newRequirement.trim()}
          >
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.requirements.map((req: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {req}
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Responsibilities */}
      <div>
        <label className="text-sm font-medium">Responsabilidades</label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Agregar una responsabilidad"
            value={newResponsibility}
            onChange={(e) => setNewResponsibility(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddResponsibility();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddResponsibility}
            disabled={!newResponsibility.trim()}
          >
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.responsibilities.map((resp: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {resp}
              <button
                type="button"
                onClick={() => handleRemoveResponsibility(index)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-medium">Habilidades Requeridas</label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Agregar una habilidad"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAddSkill}
            disabled={!newSkill.trim()}
          >
            Agregar
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill: string, index: number) => (
            <Badge key={index} className="gap-1">
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(index)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Experience and Qualifications */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Años de Experiencia</label>
          <Input
            placeholder="ej., 5+ años"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                yearsOfExperience: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-3 py-2 border border-input rounded-md text-sm"
          >
            <option value="draft">Borrador</option>
            <option value="active">Activo</option>
          </select>
        </div>
      </div>

      {/* Qualifications */}
      <div>
        <label className="text-sm font-medium">Calificaciones</label>
        <Textarea
          placeholder="Educación y otras calificaciones"
          value={formData.qualifications}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, qualifications: e.target.value }))
          }
          rows={3}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Guardar Empleo"}
        </Button>
      </div>
    </form>
  );
}
