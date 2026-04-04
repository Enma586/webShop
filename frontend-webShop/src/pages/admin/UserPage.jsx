import { useEffect, useState, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { UniversalHeader } from "@/components/Shared/DataTable/UniversalHeader";
import { UniversalTable } from "@/components/Shared/DataTable/UniversalTable";
import { UniversalFooter } from "@/components/Shared/DataTable/UniversalFooter";
import UserFormModal from "./modals/UserFormModal";
import ConfirmDeleteModal from '@/components/Shared/Modals/ConfirmDeleteModal';
import { ShieldCheck, Eye, Ban } from "lucide-react";

export default function UserPage() {
  const { users, getUsers, deleteUser } = useUser();
  const [viewMode, setViewMode] = useState("ADMIN");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => { getUsers(); }, []);

  const processedUsers = useMemo(() => {
    let result = Array.isArray(users) ? [...users] : [];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(u =>
        (u.username?.toLowerCase() || u.name?.toLowerCase())?.includes(term) ||
        u.email?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [users, searchTerm]);

  const mappedData = useMemo(() => {
    const filtered = processedUsers.filter(u => {
      const isBanned = u.status === "banned";
      if (viewMode === "BANNED") return isBanned;
      if (isBanned) return false;
      return viewMode === "ADMIN" ? u.role === "admin" : u.role === "customer";
    });

    return filtered.map(u => ({
      id: u.id,
      name: u.username || u.name,
      subtitle: `UID_${u.id.toString().padStart(4, '0')}`,
      column2: u.email,
      column3: u.role?.toUpperCase() || "USER",
      status: (u.status || "ACTIVE").toUpperCase(),
      active: u.status === "active",
      image: u.avatar || null,
    }));
  }, [processedUsers, viewMode]);

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      <section className="w-full max-w-1600px mx-auto pt-10 px-12">
        <UniversalHeader title={viewMode === "BANNED" ? "Blacklist" : "USER"} isAdmin={viewMode === "ADMIN"} onActionClick={() => setIsModalOpen(true)} onRefresh={getUsers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <div className="w-full flex bg-muted/20 border-b border-border h-12">
          {[{ id: "ADMIN", icon: ShieldCheck, label: "Personnel" }, { id: "PUBLIC", icon: Eye, label: "Customers" }, { id: "BANNED", icon: Ban, label: "Banned" }].map(mode => (
            <button key={mode.id} onClick={() => setViewMode(mode.id)} className={`flex items-center gap-3 px-8 text-[10px] font-black uppercase tracking-widest border-r border-border ${viewMode === mode.id ? "bg-background border-b-2 border-b-primary" : "text-muted-foreground hover:bg-muted/30"}`}>
              <mode.icon size={14} /> {mode.label}
            </button>
          ))}
        </div>
      </section>

      <section className="w-full max-w-1600px mx-auto px-12 pb-24">
        <UniversalTable data={mappedData} columns={["Entity Name", "Identity Mail", "Access Level", "Status", "Execute"]} isAdmin={true} onDelete={(id) => { setUserToDelete(users.find(u => u.id === id)); setIsDeleteModalOpen(true); }} onEdit={(id) => { setSelectedUserId(id); setIsModalOpen(true); }} />
      </section>
      <footer className="w-full border-t border-border bg-muted/5 py-10 px-12 mt-auto">
        <UniversalFooter count={mappedData.length} isAdmin={true} />
      </footer>
      <UserFormModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedUserId(null); }} userId={selectedUserId} />
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={async () => { await deleteUser(userToDelete.id); setIsDeleteModalOpen(false); }} itemName={userToDelete?.name} />
    </div>
  );
}