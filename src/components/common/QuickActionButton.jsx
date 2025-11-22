import Link from 'next/link';

export default function QuickActionButton({ title, icon, href }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 bg-[#1e2737] rounded-lg hover:bg-[#2a3441] transition-colors text-center group"
    >
      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-white text-sm font-medium">{title}</span>
    </Link>
  );
}