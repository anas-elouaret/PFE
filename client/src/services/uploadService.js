import apiClient from "../api/client";

export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (e.total && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });
  return data;
}

export async function uploadAudioRecording(blob, onProgress) {
  const file = new File([blob], "voice-message.webm", { type: "audio/webm" });
  return uploadFile(file, onProgress);
}

export async function submitProjectRequest(payload) {
  const { data } = await apiClient.post("/projects", payload);
  return data;
}
