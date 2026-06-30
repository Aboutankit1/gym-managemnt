import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick, title }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-surface/90 px-4 backdrop-blur sm:px-6">
      <button onClick={onMenuClick} className="text-ink-soft lg:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="font-display text-lg font-semibold text-ink">{title}</h1>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            placeholder="Search members, payments..."
            className="h-9 w-64 rounded-lg border border-line bg-bg pl-9 pr-3 text-sm placeholder:text-ink-faint focus-visible:ring-2 focus-visible:ring-violet/40"
          />
        </div>

        <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-soft hover:bg-bg">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-line py-1 pl-1 pr-2 hover:bg-bg"
          >
            <div className="grid h-7 w-7 place-items-center rounded-md bg-violet-soft font-display text-xs font-semibold text-violet">
              {user?.name?.charAt(0) || "A"}
            </div>
            <span className="hidden text-sm font-medium text-ink sm:block">
              {user?.name || "Admin"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-faint" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 w-44 rounded-lg border border-line bg-surface p-1 shadow-lg">
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-danger hover:bg-danger-soft"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
