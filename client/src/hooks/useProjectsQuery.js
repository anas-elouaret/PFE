import { useState, useEffect, useCallback } from "react";
import * as projectApi from "../api/projects";

export function useProjectsQuery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectApi.getMyProjects();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(async (projectData) => {
    const project = await projectApi.createProject(projectData);
    setProjects((prev) => [project, ...prev]);
    return project;
  }, []);

  const updateStatus = useCallback(async (id, status, note) => {
    const updated = await projectApi.updateProjectStatus(id, status, note);
    setProjects((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? updated : p))
    );
    return updated;
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateStatus,
    refresh: fetchProjects,
  };
}
