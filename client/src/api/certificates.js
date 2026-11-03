import apiClient from "./client";

/** The signed-in reader's own attestations. */
export const getMyCertificates = async () => {
  const { data } = await apiClient.get("/certificates/me");
  return data.certificates;
};

export const getMyCertificate = async (reference) => {
  const { data } = await apiClient.get(`/certificates/me/${reference}`);
  return data.certificate;
};

/** Public check of a reference. Resolves with { valid, certificate } or throws. */
export const verifyCertificate = async (reference) => {
  const { data } = await apiClient.get(
    `/certificates/verify/${encodeURIComponent(reference)}`
  );
  return data;
};
