import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { EntityAvatar } from "./ui/EntityAvatar";
import { getUserAvatarUrl, getUserDisplayName } from "../lib/user";

const tabs = [
  {
    label: "Home",
    to: "/dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "Pets",
    to: "/pets",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    label: "Expenses",
    to: "/expenses",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { user } = useAuth();
  const avatarUrl = getUserAvatarUrl(user);
  const displayName = getUserDisplayName(user);

  return (
    <div data-bottom-nav="true" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:hidden">
      <nav
        className="flex items-center gap-1 rounded-[28px] border border-white/70 bg-white/92 px-3 py-2 backdrop-blur-sm"
        style={{ boxShadow: "0 16px 40px rgba(34, 26, 22, 0.12)" }}
      >
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-xs font-medium transition-all ${
                isActive ? "bg-[#fff4f1] text-[#ff7a5c]" : "text-gray-400 hover:text-gray-600"
              }`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-2xl px-4 py-2 text-xs font-medium transition-all ${
              isActive ? "bg-[#fff4f1] text-[#ff7a5c]" : "text-gray-400 hover:text-gray-600"
            }`
          }
        >
          <EntityAvatar
            src={avatarUrl}
            name={displayName}
            kind="user"
            className="h-5 w-5 rounded-full"
            textClassName="text-[9px]"
          />
          Profile
        </NavLink>
      </nav>
    </div>
  );
}
