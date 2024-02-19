"use client"

import React, { useEffect } from 'react'
import { setCurrentUserGlobal } from '../../../lib/prisma-commands';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetUserOnLoad() {

    let router = useRouter();

    useEffect(() => {
        setCurrentUserGlobal({ userId: -1 }).then(() => {
            router.push('/home');
        })
    }, [])

    return (
        <main className="flex h-1/2 w-full items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={80} />
        </main>
    )
}
