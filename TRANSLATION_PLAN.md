# Spanish Translation Plan

## Overview
Translate all UI/visual text from English to Spanish while keeping internal code (variables, functions, API endpoints) in English.

## Files to Translate (Priority Order)

### 1. Dashboard Pages
- [ ] `app/dashboard/page.tsx` - Dashboard home (cards, stats, titles)
- [ ] `app/dashboard/jobs/page.tsx` - Jobs page
- [ ] `app/dashboard/candidates/page.tsx` - Candidates page
- [ ] `app/dashboard/schedules/page.tsx` - Schedules/Interviews page
- [ ] `app/dashboard/settings/page.tsx` - Settings page

### 2. Dashboard Components
- [ ] `components/dashboard/app-sidebar.tsx` - Sidebar navigation
- [ ] `components/dashboard/add-candidate-dialog.tsx` - Add candidate dialog
- [ ] `components/dashboard/add-job-dialog.tsx` - Add job dialog
- [ ] `components/dashboard/candidate-form.tsx` - Candidate form
- [ ] `components/dashboard/job-form.tsx` - Job form
- [ ] `components/dashboard/job-card.tsx` - Job card
- [ ] `components/dashboard/candidate-card.tsx` - Candidate card
- [ ] `components/dashboard/candidate-list-item.tsx` - Candidate list item

### 3. Settings Components
- [ ] `components/settings/voice-agent-settings.tsx` - Voice agent settings
- [ ] `components/settings/interview-configuration-settings.tsx` - Interview config
- [ ] `components/settings/ai-prompt-settings.tsx` - AI prompt settings
- [ ] `components/settings/notification-settings.tsx` - Notification settings
- [ ] `components/settings/performance-settings.tsx` - Performance settings

### 4. Interview Pages
- [ ] `app/interview/[interviewId]/page.tsx` - Interview start page
- [ ] `app/interview/[interviewId]/session/page.tsx` - Interview session page
- [ ] `app/interview/[interviewId]/results/page.tsx` - Interview results page

### 5. Interview Components
- [ ] `components/interview/pending-invites-list.tsx` - Pending invites list
- [ ] `components/interview/completed-interviews-list.tsx` - Completed interviews

### 6. Landing Page (Partial)
- [ ] `components/landing/Navbar.tsx` - Navbar (buttons, links)

## Key Translation Patterns

### Navigation
- Home → Inicio
- Jobs → Empleos
- Candidates → Candidatos
- Schedules → Agendas/Entrevistas
- Settings → Configuración

### Common UI Elements
- Add → Agregar/Nuevo
- Edit → Editar
- Delete → Eliminar
- Save → Guardar
- Cancel → Cancelar
- Search → Buscar
- Filter → Filtrar
- Back → Volver
- Next → Siguiente
- Previous → Anterior
- Confirm → Confirmar
- Loading → Cargando
- Submit → Enviar

### Form Labels
- First Name → Nombre
- Last Name → Apellido
- Email → Correo electrónico
- Phone → Teléfono
- Position → Posición/Cargo
- Experience → Experiencia
- Skills → Habilidades
- Description → Descripción
- Requirements → Requisitos
- Responsibilities → Responsabilidades
- Location → Ubicación
- Salary Range → Rango Salarial
- Job Type → Tipo de empleo
- Department → Departamento
- Status → Estado

### Dashboard Terms
- Dashboard → Panel de Control
- Total Jobs → Total de Empleos
- Active Jobs → Empleos Activos
- Total Candidates → Total de Candidatos
- Hired → Contratados
- Interviews This Week → Entrevistas Esta Semana
- Completed Interviews → Entrevistas Completadas
- Pending Invites → Invitaciones Pendientes
- Recent Jobs → Empleos Recientes
- Recent Candidates → Candidatos Recientes
- Interview Activity → Actividad de Entrevistas
- View all → Ver todos

### Settings Terms
- Voice Agent Configuration → Configuración del Agente de Voz
- Voice Type → Tipo de Voz
- Voice Tone → Tono de Voz
- Language Preference → Idioma Preferido
- Interview Configuration → Configuración de Entrevista
- Questions Configuration → Configuración de Preguntas
- Time Configuration → Configuración de Tiempo
- Interview Flow → Flujo de Entrevista
- AI Prompt & Evaluation Settings → Configuración de IA y Evaluación
- Notification Settings → Configuración de Notificaciones
- Performance & Recording → Rendimiento y Grabación
- Branding & Personalization → Marca y Personalización

### Interview Terms
- Ready to Begin? → ¿Listo para Comenzar?
- Start Interview → Iniciar Entrevista
- End Call → Terminar Llamada
- Mute Mic / Unmute Mic → Silenciar / Activar Micrófono
- Camera On / Off → Cámara Encendida/Apagada
- AI Interviewer → Entrevistador IA
- Live Transcript Chat → Chat de Transcripción en Vivo
- Interview Completed → Entrevista Completada
- Questions Answered → Preguntas Respondidas
- Duration → Duración
- Overall Rating → Calificación General
- Recommendation → Recomendación
- Strengths → Fortalezas
- Areas for Growth → Áreas de Mejora

## Implementation Notes
- Keep all variable names, function names, and API routes in English
- Only translate visible text (UI labels, buttons, messages, placeholders)
- Maintain proper Spanish punctuation (inverted ?¡ and ¡¿)
- Use consistent terminology throughout

