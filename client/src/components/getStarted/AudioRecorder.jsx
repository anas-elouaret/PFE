import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, AlertCircle } from "lucide-react";

function formatDuration(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function AudioRecorder({ onAudioReady, onAudioDelete }) {
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? { mimeType: "audio/webm;codecs=opus" }
        : MediaRecorder.isTypeSupported("audio/webm")
          ? { mimeType: "audio/webm" }
          : {};

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          setError("Aucune donnée audio capturée. Veuillez réessayer.");
          stream.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
          return;
        }
        const recordedType = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: recordedType });
        const url = URL.createObjectURL(blob);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(url);
        if (onAudioReady) onAudioReady(blob, url);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start(250);
      startTimeRef.current = Date.now();
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 200);
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Impossible d'accéder au microphone. Vérifiez les permissions.");
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder && recording) {
      try {
        if (typeof mediaRecorder.requestData === "function") {
          mediaRecorder.requestData();
        }
      } catch (err) {
        console.error("requestData failed:", err);
      }
      try {
        mediaRecorder.stop();
      } catch (err) {
        console.error("stop failed:", err);
      }
      setRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    const url = audioUrl;
    if (url) URL.revokeObjectURL(url);
    setAudioUrl(null);
    audioChunksRef.current = [];
    if (onAudioDelete && url) onAudioDelete(url);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-3">
      {!audioUrl ? (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition-colors ${
              recording ? "bg-red-500 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {recording ? (
              <>
                <Square className="w-4 h-4 pointer-events-none" />
                Arrêter ({formatDuration(duration)})
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 pointer-events-none" />
                Enregistrer un message vocal
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <audio controls src={audioUrl} className="w-full h-10" />
          <button
            type="button"
            onClick={deleteRecording}
            className="text-red-500 hover:text-red-700 text-sm font-semibold cursor-pointer whitespace-nowrap"
          >
            Supprimer
          </button>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-500">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
