"use client";

import { Suspense } from "react";
import ProjectsContent from "./ProjectsContent";

export default function ProjectsPage() {
    return (
        <Suspense fallback={<ProjectsPageSkeleton />}>
            <ProjectsContent />
        </Suspense>
    );
}

function ProjectsPageSkeleton() {
    return (
        <>
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
                <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
                <div className="container-custom relative">
                    <div className="max-w-3xl">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                        <div className="h-12 w-96 bg-gray-200 rounded mb-6 animate-pulse" />
                        <div className="h-6 w-full bg-gray-200 rounded mb-4 animate-pulse" />
                        <div className="h-6 w-3/4 bg-gray-200 rounded mb-8 animate-pulse" />
                        <div className="h-12 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                </div>
            </section>
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="mb-12 flex justify-center">
                        <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
                                <div className="h-4 w-24 bg-gray-200 rounded mx-auto animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
