import { Home, Briefcase, Wallet, Settings, LucideIcon } from "lucide-react";

interface BottomNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

function BottomNavItem({ icon: Icon, label, active }: BottomNavItemProps) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center flex-1 py-2 text-xs font-medium transition-colors ${
        active ? "text-evzone-green" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      <Icon className="h-5 w-5 mb-0.5" />
      <span>{label}</span>
    </button>
  );
}

interface BottomNavProps {
  active?: "home" | "manager" | "wallet" | "settings";
}

/**
 * Bottom navigation shared across Driver App previews.
 */
export default function BottomNav({ active = "home" }: BottomNavProps) {
  return (
    <nav className="border-t border-slate-100 bg-white/95 backdrop-blur flex">
      <BottomNavItem icon={Home} label="Home" active={active === "home"} />
      <BottomNavItem
        icon={Briefcase}
        label="Manager"
        active={active === "manager"}
      />
      <BottomNavItem
        icon={Wallet}
        label="Wallet"
        active={active === "wallet"}
      />
      <BottomNavItem
        icon={Settings}
        label="Settings"
        active={active === "settings"}
      />
    </nav>
  );
}
