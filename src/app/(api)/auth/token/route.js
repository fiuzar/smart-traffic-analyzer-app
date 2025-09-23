import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { query } from "@/dbh";
import crypto from "crypto";
import { getClientIp } from "@/server-actions/getClientIp";

export function hashValue(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
}

export async function POST(request) {
    const token = uuid();
    const headers = Object.fromEntries(request.headers.entries());
    let ipAddress = getClientIp(headers);
    const daily_sec = 24 * 60 * 60;
    const current_time = Math.floor(Date.now() / 1000);

    if (!ipAddress) ipAddress = "unknown";
    const ipHash = hashValue(ipAddress);

    try {

        const checkExistingText = 'SELECT * FROM smart_traffic_analyzer_token WHERE ip_address = $1 ORDER BY created_at DESC LIMIT 1';
        const checkExistingValues = [ipHash];
        const existingResult = await query(checkExistingText, checkExistingValues);
        const existingDetails = existingResult.rows[0];

        if (existingDetails && existingDetails.expiry_time && parseInt(existingDetails.expiry_time) > current_time) {
            return NextResponse.json({ success: false, token: existingDetails.token, message: "Token already exists, wait for 24hrs to create new one" }, { status: 400 } );
        }        

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Server error please try again later" }, { status: 500 } );
    }


    const formData = await request.formData();
    const video_input = formData.get('input_type');
    const video_file = formData.get('video_file') || null;

    // Clarified logic:
    // - 'camera': user connects external camera, no video file expected
    // - 'stream': user streams from phone/webcam via browser, video file upload expected
    // - 'file': user uploads a video file

    if (!video_input || (video_input !== 'camera' && video_input !== 'file' && video_input !== 'stream')) {
        return NextResponse.json({ success: false, message: "Invalid video input type" }, { status: 400 });
    }
    if (video_input === 'file' && !video_file) {
        return NextResponse.json({ success: false, message: "Video is required for file or stream inputs" }, { status: 400 });
    }
    if ((video_input === 'camera' || video_input === "stream") && video_file) {
        return NextResponse.json({ success: false, message: "Video file should not be provided for camera input" }, { status: 400 });
    }

    let video_url = null;

    if(video_file) {
        const max_video_size = 20 * 1024 * 1024; // 20 MB
        const allowed_extensions = ['mp4', 'avi', 'webm'];

        if (video_file.size > max_video_size) {
            return NextResponse.json({ success: false, message: "Video file size exceeds the 20MB limit" }, { status: 400 });
        }
        const fileExtension = video_file.name.split('.').pop().toLowerCase();
        if (!allowed_extensions.includes(fileExtension)) {
            return NextResponse.json({ success: false, message: "Invalid video file type" }, { status: 400 });
        }

        const form_data = new FormData()
        form_data.append('file', video_file)
        form_data.append('category', 'media');

        try {

            const uploadResponse = await fetch('https://api.anonfiles.com/upload', {
                method: 'POST',
                body: form_data
            });
            const uploadResult = await uploadResponse.json();
            if (uploadResult.status) {
                video_url = uploadResult.data.file.url.full;
            } else {
                return NextResponse.json({ success: false, message: "Error uploading video file",}, { status: 500 });
            }
            
        } catch (error) {
            return NextResponse.json({ success: false, message: "Error uploading video file", }, { status: 500 });
        }
    }

    try {
        const insertText = 'INSERT INTO smart_traffic_analyzer_token(token, ip_address, video_input, video_url, expiry_time) VALUES($1, $2, $3, $4, $5)';
        const insertValues = [token, ipHash, video_input, video_url, current_time + daily_sec];
        await query(insertText, insertValues);

        return NextResponse.json({ success: true, token, message: "Token created successfully. This token is valid for 30 minutes" }, { status: 200 } );
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Server error please try again later" }, { status: 500 } );
    }
}