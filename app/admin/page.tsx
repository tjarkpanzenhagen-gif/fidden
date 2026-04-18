import AdminPanel from "@/components/AdminPanel";

export const metadata = { title: "Admin — DJ FIDDEN" };

export default function AdminPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <AdminPanel />
      </div>
    </div>
  );
}
