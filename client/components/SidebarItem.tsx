import React from "react";
import { NavLink } from "react-router-dom";
import { UserRole } from "../types";

interface SidebarItemProps {
  to: string;
  icon: any;
  label: string;
  roles: UserRole[];
  currentUserRole: UserRole;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon: Icon,
  label,
  roles,
  currentUserRole,
}) => {
  if (!roles.includes(currentUserRole)) return null;
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? "bg-indigo-600 text-white shadow-xl shadow-indigo-500/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon size={20} />
      <span className="font-semibold text-sm">{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
