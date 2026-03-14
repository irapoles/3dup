"use client";

import { useState, useCallback } from "react";
import { getSignedUploadUrl } from "@/lib/actions/files";

type UploadState = "idle" | "uploading" | "complete" | "error";

export function useUploadFile(bucket: string) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File, path: string): Promise<string | null> => {
      setState("uploading");
      setProgress(0);
      setError(null);

      try {
        const result = await getSignedUploadUrl(bucket, path);
        if (!result.success) {
          throw new Error(result.error);
        }

        const { signedUrl, token } = result.data;

        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setState("complete");
              setProgress(100);
              resolve(path);
            } else {
              setState("error");
              setError("Upload failed");
              reject(new Error("Upload failed"));
            }
          });
          xhr.addEventListener("error", () => {
            setState("error");
            setError("Upload failed");
            reject(new Error("Upload failed"));
          });
          xhr.open("PUT", signedUrl);
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          xhr.setRequestHeader("Content-Type", file.type);
          xhr.send(file);
        });
      } catch (err) {
        setState("error");
        setError(err instanceof Error ? err.message : "Upload failed");
        return null;
      }
    },
    [bucket],
  );

  const reset = useCallback(() => {
    setState("idle");
    setProgress(0);
    setError(null);
  }, []);

  return { upload, state, progress, error, reset };
}
