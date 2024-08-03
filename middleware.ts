import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from "next/server";

function excludeSignInRoute(pathname: string) {
    if(/\/pembayaran\/create/gi.test(pathname)) return true;

    return /(signin|signinadmin)/gi.test(pathname);
}

function excludeSiswaRoleRoute(pathname: string) {
    if(/\/tagihan/gi.test(pathname)){
        return /(create|delete)/gi.test(pathname)
    } else if(/\/user/gi.test(pathname)) {
        return /(create|delete|update)/.test(pathname)
    }
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const { token } = await req.json();

    if (!excludeSignInRoute(pathname)) {
        if (token) {
            const secret = new TextEncoder().encode(process.env.SECRET);

            try {
                const { payload } = await jwtVerify(token, secret);
                console.log(payload)
                if (payload.role === 'SISWA' && excludeSiswaRoleRoute(pathname)) {
                    return NextResponse.json({ message: 'unauthorized' }, { status: 401 })
                }

                return NextResponse.next()
            } catch (error) {
                return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });
            }
        }
        console.log('exclude fails')
        return NextResponse.json({ message: 'unauthenticated: no token' }, { status: 401 })
    }

    return NextResponse.next()
}