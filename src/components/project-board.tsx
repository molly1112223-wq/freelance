"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectBriefComposer } from "@/components/project-brief-composer";
import { ProjectSearch, type Project } from "@/components/project-search";

export function ProjectBoard({
  initialProjects,
  initialQuery,
  userRole
}: {
  initialProjects: Project[];
  initialQuery: string;
  userRole: "client" | "freelancer" | "admin" | null;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  function handlePublish(project: Project) {
    setProjects((current) => [project, ...current]);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <ProjectSearch initialQuery={initialQuery} projects={projects} />
      <ProjectBriefComposer canPublish={userRole === "client" || userRole === "admin"} onPublish={handlePublish} userRole={userRole} />
    </div>
  );
}
