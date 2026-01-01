"use client";
import React from 'react';
import { Layout } from '@/components/ui_v2/Layout';

interface PlaceholderProps {
    title: string;
    description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderProps) {
    return (
        <Layout>
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <h1 className="text-4xl font-bold text-slate-800 mb-4">{title}</h1>
                <p className="text-slate-500 max-w-md">
                    {description || "Módulo em desenvolvimento. As conexões neurais estão sendo estabelecidas."}
                </p>
                <div className="mt-8">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        </Layout>
    );
}
