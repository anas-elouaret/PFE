import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as projectApi from "../api/projects";

const ProjectContext = createContext(null);

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  const createProject = useCallback(async (data) => {
    setSubmitting(true);
    setError(null);
    try {
      const project = await projectApi.createProject(data);
      setProjects(prev => [project, ...prev]);
      return project;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, newStatus, note) => {
    try {
      const updated = await projectApi.updateProjectStatus(id, newStatus, note);
      setProjects(prev => prev.map(p => (p._id === id || p.id === id) ? updated : p));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  return (
    <ProjectContext.Provider value={{ projects, loading, submitting, error, createProject, updateStatus, refresh: fetchProjects }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
  return ctx;
}
