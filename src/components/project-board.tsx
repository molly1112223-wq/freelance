"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProjectBriefComposer } from "@/components/project-brief-composer";
import { ProjectSearch, type Project } from "@/components/project-search";

export function ProjectBoard({ initialProjects }: { initialProjects: Project[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);

  function handlePublish(project: Project) {
    setProjects((current) => [project, ...current]);
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <ProjectBriefComposer onPublish={handlePublish} />
      <ProjectSearch projects={projects} />
    </div>
  );
}
