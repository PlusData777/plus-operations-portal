import Image from "next/image";

const OFFICIAL_PLUS_LOGO = "https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1-768x593.png";

export function OfficialPlusLogo({ className = "", alt = "Pakistan Legal United Society official logo" }: { className?: string; alt?: string }) {
  return <Image src={OFFICIAL_PLUS_LOGO} alt={alt} width={768} height={593} className={`object-contain ${className}`} />;
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><OfficialPlusLogo className="h-12 w-[62px] shrink-0" />{!compact && <div><p className="text-sm font-extrabold tracking-tight text-navy">Pakistan Legal United Society</p><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Operations &amp; Approval Portal</p></div>}</div>;
}
