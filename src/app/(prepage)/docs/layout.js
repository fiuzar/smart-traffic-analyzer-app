import DocsHeader from "@/components/docs/docs-header";

export default function InterviewLayout({ children }) {
    return (
        <>
            <DocsHeader />
            <main className="sm:container mx-auto w-[100vw] h-auto bg-white dark:bg-zinc-900 py-3">
                {children}
            </main>
        </>
    );
}