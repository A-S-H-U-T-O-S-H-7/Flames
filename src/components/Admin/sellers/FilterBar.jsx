"use client";

import { Users, AlertTriangle, CheckCircle, XCircle, Ban } from "lucide-react";

export default function FilterBar({ statusFilter, onChange }) {
  return (
    <div className="bg-[#0e1726] rounded-xl p-4 border border-gray-700">
      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={statusFilter === ""}
          onClick={() => onChange("")}
          label="All Sellers"
          icon={<Users className="w-4 h-4" />}
        />
        <FilterButton
          active={statusFilter === "pending"}
          onClick={() => onChange("pending")}
          label="Pending Approval"
          color="bg-yellow-600"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
        <FilterButton
          active={statusFilter === "approved"}
          onClick={() => onChange("approved")}
          label="Approved"
          color="bg-green-600"
        />
        <FilterButton
          active={statusFilter === "rejected"}
          onClick={() => onChange("rejected")}
          label="Rejected"
          color="bg-red-600"
        />
        <FilterButton
          active={statusFilter === "suspended"}
          onClick={() => onChange("suspended")}
          label="Suspended"
          color="bg-gray-600"
          icon={<Ban className="w-4 h-4" />}
        />
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, icon, color = "bg-[#22c7d5]" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? `${color} text-white`
          : 'bg-[#1e2737] text-gray-300 hover:bg-[#2a3441] border border-gray-600'
      }`}
    >
      {icon && icon}
      {label}
    </button>
  );
}


