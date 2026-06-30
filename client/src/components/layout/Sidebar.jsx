import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Wallet,
  Dumbbell,
  Settings,
  ScanLine,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/members", label: "Members", icon: Users },
  { to: "/memberships", label: "Memberships", icon: CreditCard },
  { to: "/attendance", label: "Attendance", icon: ScanLine },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/trainers", label: "Trainers", icon: Dumbbell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-volt">
              <Dumbbell className="h-5 w-5 text-volt-ink" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold text-white">
              FlexCore
            </span>
          </div>
          <button onClick={onClose} className="text-white/60 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/55 transition-colors hover:bg-sidebar-soft hover:text-white",
                  isActive && "bg-sidebar-soft text-white"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "absolute left-0 h-5 w-[3px] rounded-r-full bg-volt opacity-0 transition-opacity",
                      isActive && "opacity-100"
                    )}
                  />
                  <Icon className="h-4.5 w-4.5 shrink-0" strokeWidth={2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mx-3 mb-5 rounded-xl bg-sidebar-soft p-4">
          <p className="font-display text-sm font-semibold text-white">Upgrade to Pro</p>
          <p className="mt-1 text-xs text-white/50">
            Unlock multi-branch reports and SMS reminders.
          </p>
          <button className="mt-3 w-full rounded-lg bg-volt py-2 text-xs font-semibold text-volt-ink">
            Learn more
          </button>
        </div>
      </aside>
    </>
  );
}
