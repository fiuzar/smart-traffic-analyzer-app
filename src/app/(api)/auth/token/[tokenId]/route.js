import { query } from '@/dbh'
import { NextResponse } from 'next/server'

export async function DELETE(request, context) {
    const { tokenId } = await context.params;

    if (!tokenId) {
        return NextResponse.json({ success: false, message: "Token ID is required" }, { status: 400 });
    }

    try {
        const delete_text = `DELETE FROM smart_traffic_analyzer_token RETURNING *`;
        const delete_query = await query(delete_text);

        if (delete_query.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Token not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Token deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: "Internal server error, please try again later" }, { status: 500 });
    }
}