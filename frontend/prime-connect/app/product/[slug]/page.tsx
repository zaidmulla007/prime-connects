import ProductPageClient from "./ProductPageClient";

// Default slugs used as fallback when the API is unavailable during build
const FALLBACK_SLUGS = [
    'mdf-doors', 'wpc-doors', 'wooden-doors', 'aluminium-doors',
    'iron-and-steel-doors', 'emergency-exit-doors', 'core-panels', 'color-card',
];

// Generate static params from API at build time
export async function generateStaticParams() {
    try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const res = await fetch(`${apiBase}/public/products?per_page=500`, { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            const slugs = (data?.data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
            if (slugs.length > 0) return slugs;
        }
    } catch {
        // API unavailable during build — fall through to defaults
    }
    return FALLBACK_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function ProductPage() {
    return <ProductPageClient />;
}
