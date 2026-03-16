import SessionProviderWrapper from "./_components/SessionProviderWrapper";
import Sidebar from "./_components/Sidebar";
import { getServerSession } from "next-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <SessionProviderWrapper>
      <div className="flex h-screen overflow-hidden" style={{ background: "#f2f2f2" }}>
        {session && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </SessionProviderWrapper>
  );
}
