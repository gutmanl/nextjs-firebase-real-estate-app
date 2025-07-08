export default function Layout({ children }: { children: React.ReactNode }) {
    return <div className="max-w-(--breakpoint-sm) mx-auto p-5 ">
        {children}
    </div>;
}
