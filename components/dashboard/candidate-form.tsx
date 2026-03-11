"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const candidateSchema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  position: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
  qualifications: z.string().optional(),
  notes: z.string().optional(),
});

type CandidateFormValues = z.infer<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Partial<CandidateFormValues>;
  resumeUrl?: string;
  onSuccess?: () => void;
}

export function CandidateForm({
  initialData,
  resumeUrl,
  onSuccess,
}: CandidateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      position: initialData?.position || "",
      experience: initialData?.experience || "",
      skills: Array.isArray(initialData?.skills)
        ? initialData.skills.join(", ")
        : initialData?.skills || "",
      qualifications: initialData?.qualifications || "",
      notes: initialData?.notes || "",
    },
  });

  const onSubmit = async (values: CandidateFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert skills back to array if needed
      const payload = {
        ...values,
        skills: values.skills,
        resumeUrl: resumeUrl || null,
      };

      const response = await fetch("/api/candidates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add candidate");
      }

      toast.success("Candidate added successfully!");
      onSuccess?.();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add candidate"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
<FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre *</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido *</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="juan@ejemplo.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="+52 555 000 0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posición</FormLabel>
                <FormControl>
                  <Input placeholder="Desarrollador Senior" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experiencia</FormLabel>
                <FormControl>
                  <Input placeholder="5 años" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Habilidades</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="JavaScript, React, Node.js, Python..."
                  {...field}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormDescription>
                Separa las habilidades con comas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qualifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Educación y Certificaciones</FormLabel>
              <FormControl>
                <Textarea placeholder="Ingresa las certificaciones..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Agrega notas adicionales..."
                  {...field}
                  className="resize-none"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Agregando Candidato..." : "Agregar Candidato"}
        </Button>
      </form>
    </Form>
  );
}
