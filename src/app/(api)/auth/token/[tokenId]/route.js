import { query } from '@/dbh'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
    const { tokenId } = await request

    try {

        const delete_text = `DELETE FROM smart_traffic_analyzer_token WHERE token=$1`
        const delete_query = await query(delete_text, [tokenId])

        return NextResponse.json({ success: true, message: "Token deleted successfully" })

    }
    catch (error) {
        return NextResponse.json({ success: false, message: "Internal server error, please try again later" }, { status: 500 })
    }
}