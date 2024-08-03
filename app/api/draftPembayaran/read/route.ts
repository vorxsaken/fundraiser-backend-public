import { NextResponse } from "next/server";
import { database } from "../../base";

export async function POST(req: Request) {
    const { id_tagihan } = await req.json()
    
    try {
        const draftTagihan = await database.draftTagihan.findMany({
            where: {
                id_tagihan: id_tagihan || 0,
                kondisi: 0
            }
        }).catch(err => { throw new Error(err) });

        const res = draftTagihan.map(val => ({...val, status: val.kondisi}))

        return NextResponse.json(res[0] || {}, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }

}