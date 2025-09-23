import DocsHeader from "@/components/docs/docs-header"

export default function DashboardLayout({ children }) {
    return (
        <>
            <DocsHeader />
            <main className="sm:container mx-auto w-[100vw] h-auto py-3">
                {children}
            </main>
        </>
    )
}