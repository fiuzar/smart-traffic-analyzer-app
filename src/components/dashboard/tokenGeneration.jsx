'use client'

import { useEffect, useState, useContext } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { TokenContext } from "@/app/(prepage)/dashboard/page"; // import context
import Cookies from 'js-cookie'

export default function TokenGeneration() {
    const { token, setToken } = useContext(TokenContext); // use context

    const [inputType, setInputType] = useState('');
    const [video_url, setVideoUrl] = useState(null);
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {

        if(inputType !== "file"){
            setVideoUrl(null)
        }

    }, [inputType])

    const generateToken = async () => {

        if(inputType == 'file' && video_url == null) {
            setError("Please upload a video file")

            setTimeout(() => {
                setError("")
            }, 5000);

            return
        }

        const formData = new FormData();
        formData.append('input_type', inputType);

        if(inputType == 'file' && video_url) {
            formData.append("video_file", video_url)
        }
        
        const res = await fetch('/auth/token', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        if (data.success) {

            Cookies.set('token', data.token, { expires: 24/40 }); // 30 minutes
            setToken(data.token);
            setSuccess(true)

            setTimeout(() => {
                setSuccess(false)
            }, 5000);
            return
        } else {
            setError(data.message)
            setTimeout(() => {
                setError("")
            }, 5000);
            return;
        }
    };

    return (
        <div className="max-w-md mt-6 mx-auto relative flex flex-col items-start border border-zinc-100 dark:border-zinc-700/40 rounded-lg py-2 px-4 overflow-hidden">
            <h2 className="font-bold tracking-tight text-lg border-b w-full py-3">Create Token</h2>

            <div className="py-2 w-full">
                {error && (
                    <Alert variant={`destructive`}>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertTitle className={`text-green-800`}>Token created successfully</AlertTitle>
                        <AlertDescription>Copy this token and use it for testing. It is valid for 30 minutes

                            <div className="font-bold">Token:</div>
                            <div className="bg-zinc-900 p-2 border-2 rounded-lg w-full">{token}</div>
                        </AlertDescription>
                    </Alert>
                )}

            </div>

            <div className="w-full mt-4">
                <label className="block text-sm font-medium mb-1">Video Input Type</label>
                <Select
                    defaultValue={inputType}
                    onValueChange={(value) => setInputType(value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select input type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="camera">Camera (External RTSP/HLS)</SelectItem>
                        <SelectItem value="stream">Stream (Browser Webcam/Phone)</SelectItem>
                        <SelectItem value="file">File (Upload Video)</SelectItem>
                    </SelectContent>
                </Select>

                {(inputType === 'file') && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium mb-1">Video URL (for file)</label>
                        <Input type='file' />
                    </div>
                )}
            </div>
            <Button onClick={generateToken} className={`my-6 mx-auto block w-full max-w-60 bg-green-800 hover:bg-green-700 text-white cursor-pointer`}>Generate Token</Button>
        </div>
    )
}