import { useAuth } from "@/context/AuthContext";
import { useAdmin } from "@/lib/firestore/admins/read";

function Header() {
  const { user } = useAuth();
  const { data: admin } = useAdmin({ email: user?.email });

  return (
    <header className="flex items-center ml-[90px] justify-between px-6 py-4 border-b bg-white dark:bg-gray-800 dark:border-[#22c7d5]">
      {/* Left Section */}
      <div className="flex items-center gap-3">
       
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
          Admin Panel
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {admin && (
          <div className="text-right">
            <h1 className="text-sm font-semibold text-gray-800 dark:text-white">
              {admin?.name || "Admin"}
            </h1>
            <h1 className="text-xs text-gray-600 dark:text-gray-300">
              {admin?.email || "admin@example.com"}
            </h1>
          </div>
        )}
        <img
          src={user?.photoURL || "/flames1.png"}
          className="w-10 h-10 border rounded-full dark:border-gray-600"
        />
      </div>
    </header>
  );
}

export default Header;
