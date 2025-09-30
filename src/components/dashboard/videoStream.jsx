'use client'

import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Webcam from "react-webcam";

// Fix: Read env variable directly and fallback if not set
const BACKEND_URL =
  (typeof window !== "undefined" && process.env.NEXT_PUBLIC_BACKEND_URL
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : "http://127.0.0.1:8000") + "/api/v1/traffic/violations";

export default function VideoStream() {
  const cameraBtn = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const webcamRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [videoInput, setVideoInput] = useState(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const frameInterval = 30000; // ms

  // Load uploaded video
  useEffect(() => {
    if (videoInput) {
      const videoElement = videoRef.current;
      if (!videoElement) return;
      const fileURL = URL.createObjectURL(videoInput);
      videoElement.src = fileURL;
      videoElement.play();
      setStreaming(true);
      setCameraActive(false);
      setWebcamActive(false);
      clearOverlay();
    }
  }, [videoInput]);

  // Camera handling
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setMediaStream(stream);
      setStreaming(true);
      setCameraActive(true);
      setWebcamActive(false);
      setVideoInput(null);
      clearOverlay();
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setStreaming(false);
    setCameraActive(false);
    clearOverlay();
  };

  // Webcam handling
  const startWebcam = () => {
    setWebcamActive(true);
    setCameraActive(false);
    setStreaming(true);
    setVideoInput(null);
    clearOverlay();
  };

  const stopWebcam = () => {
    setWebcamActive(false);
    setStreaming(false);
    clearOverlay();
  };

  // Send frame to backend
  // const sendFrameToBackend = async (imageData) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(BACKEND_URL, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ image: imageData }),
  //     });
  //     const data = await res.json();
  //     setAnalysisResult(data);
  //     drawOverlay(data);
  //   } catch (err) {
  //     console.error("Backend error:", err);
  //     setAnalysisResult({ error: "Failed to analyze frame" });
  //     clearOverlay();
  //   }
  //   setLoading(false);
  // };

  const sendFrameToBackend = async (imageData) => {
    setLoading(true)
      const blob = await (await fetch(imageData)).blob();
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setAnalysisResult(data);
        drawOverlay(data);
      } catch (err) {
        console.error("Backend error:", err);
        setAnalysisResult({ error: "Failed to analyze frame" });
          clearOverlay();
      }
      setLoading(false)
};


  // Capture frame from <video>
  const captureFrameFromVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    sendFrameToBackend(imageData);
  };

  // Capture frame from <Webcam>
  const captureFrameFromWebcam = () => {
    if (webcamActive && webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) sendFrameToBackend(imageSrc);
    }
  };

  // Frame sending loop
  useEffect(() => {
    let intervalId;
    if (streaming && cameraActive) {
      intervalId = setInterval(captureFrameFromVideo, frameInterval);
    }
    return () => clearInterval(intervalId);
  }, [streaming, cameraActive]);

  useEffect(() => {
    let intervalId;
    if (streaming && videoInput) {
      intervalId = setInterval(captureFrameFromVideo, frameInterval);
    }
    return () => clearInterval(intervalId);
  }, [streaming, videoInput]);

  useEffect(() => {
    let intervalId;
    if (streaming && webcamActive) {
      intervalId = setInterval(captureFrameFromWebcam, frameInterval);
    }
    return () => clearInterval(intervalId);
  }, [streaming, webcamActive]);

  // Hook up camera button
  useEffect(() => {
    if (cameraBtn.current) {
      cameraBtn.current.onclick = () => {
        if (cameraActive) {
          stopCamera();
        } else {
          startCamera();
        }
      };
    }
  }, [cameraActive]);

  // Clear overlay canvas
  const clearOverlay = () => {
    const overlay = overlayRef.current;
    if (overlay) {
      const ctx = overlay.getContext("2d");
      ctx.clearRect(0, 0, overlay.width, overlay.height);
    }
  };

  // --- DRAW OVERLAY ---
  const drawOverlay = (result) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);

    if (!result || !result.detections) return;

    result.detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.box;
      ctx.strokeStyle = "lime";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

      ctx.fillStyle = "lime";
      ctx.font = "14px Arial";
      ctx.fillText(`${det.class} (${det.score.toFixed(2)})`, x1, y1 - 5);
    });

    if (result.segmentation) {
      // If segmentation mask is returned as base64 PNG, overlay it
      const img = new window.Image();
      img.src = "data:image/png;base64," + result.segmentation;
      img.onload = () => {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(img, 0, 0, overlay.width, overlay.height);
        ctx.globalAlpha = 1.0;
      };
    }
  };

  return (
    <div className="px-2">
      <div className="max-w-2xl mx-auto mt-5 relative">
        <div className="flex gap-2 align-middle mb-4">
          <Button ref={cameraBtn} className="py-6">
            {cameraActive ? "Stop Camera" : "Use Phone/Camera"}
          </Button>
          <Input
            className="my-2"
            type="file"
            accept="video/*"
            onChange={(e) => setVideoInput(e.target.files?.[0] || null)}
          />
          <Button
            className="py-6"
            onClick={() => (webcamActive ? stopWebcam() : startWebcam())}
          >
            {webcamActive ? "Stop Webcam" : "Use Webcam"}
          </Button>
        </div>

        {/* Video or webcam */}
        <div className="relative w-[640px] h-[480px] mx-auto">
          <video
            ref={videoRef}
            autoPlay
            muted
            style={{ display: streaming && !webcamActive ? "block" : "none" }}
            className="w-full h-full rounded-md"
          />
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{ display: webcamActive ? "block" : "none" }}
            className="w-full h-full rounded-md"
            width={640}
            height={480}
          />
          {/* Overlay */}
          <canvas
            ref={overlayRef}
            width={640}
            height={480}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
        </div>

        {/* Hidden canvas for frame capture */}
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{ display: "none" }}
        />

        {/* Loading + Results */}
        {loading && <div className="text-center mt-2">Analyzing...</div>}
        {analysisResult && !analysisResult.error && (
          <div className="text-center mt-2 text-sm">
            Vehicles detected: {analysisResult.detections?.length || 0}
          </div>
        )}
        {analysisResult?.error && (
          <div className="text-center mt-2 text-red-500">
            {analysisResult.error}
          </div>
        )}
      </div>
    </div>
  );
}
