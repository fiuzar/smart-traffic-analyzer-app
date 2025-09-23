import {v4 as uuid} from "uuid";
import * as wrtc from "wrtc";
import Jimp from 'jimp';
import {query} from "@/dbh";
import {NextResponse} from "next/server";
import {getClientIp} from "@/server-actions/getClientIp";
import crypto from "crypto";
import { hashValue } from "@/app/(api)/auth/token/route";
import fs from "fs";
import path from "path";
import os from "os";

// POST handler for receiving video frames
export async function POST(request) {
    try {
        const formData = await request.formData();
        const frame = formData.get('frame');
        const token = formData.get('token');

        if (!frame || !(frame instanceof Blob)) {
            return NextResponse.json({ success: false, message: "No frame uploaded" }, { status: 400 });
        }

        // Save the frame to a temp directory (for demonstration)
        const buffer = Buffer.from(await frame.arrayBuffer());
        const tempDir = path.join(os.tmpdir(), "traffic_frames");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
        const filename = `frame_${Date.now()}_${Math.floor(Math.random()*10000)}.jpg`;
        const filePath = path.join(tempDir, filename);
        fs.writeFileSync(filePath, buffer);

        // Optionally: process frame, associate with token, etc.

        return NextResponse.json({ success: true, message: "Frame received" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
    }
}