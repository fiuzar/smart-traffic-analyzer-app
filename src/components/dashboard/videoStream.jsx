'use client'

import { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import TrafficSDK from "smart-traffic-analyzer"

export default function VideoStream() {
    const [streaming, setStreaming] = useState(false);
    const [sdk, setSdk] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraBtn = useRef(null);
    const webcamBtn = useRef(null);
    const [videoInput, setVideoInput] = useState("");

    useEffect(() => {
        const initSDK = async () => {
            const sdkInstance = new TrafficSDK();
            await sdkInstance.init();
            setSdk(sdkInstance);
            console.log("SDK initialized")
        }

        initSDK();
    }, [])

    return (
        <div className="px-2">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="max-w-2xl mx-auto mt-5 overflow-hidden h-auto rounded-lg">

                <div className="flex gap-2 align-middle mb-4">
                    <Button ref={cameraBtn} className={`py-6`}>Use Phone/Camera</Button>
                    <Input className={`my-2`} type="file" value={videoInput} onChange={(e) => setVideoInput(e.target.files[0])} />
                    <Button ref={webcamBtn} className={`py-6`}>Use Webcam</Button>
                </div>

                <video ref={videoRef} autoPlay muted style={{ display: streaming ? 'block' : 'none' }} className="h-[480px] w-[640px] mx-auto" />
                <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }} />
                
            </div>
        </div>
    );
}