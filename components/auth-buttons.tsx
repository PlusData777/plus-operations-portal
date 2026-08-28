"use client";
import { signIn, signOut } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";
export function SignInButton({ disabled = false }: { disabled?: boolean }) { return <button disabled={disabled} onClick={() => signIn("google", { callbackUrl: "/" })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-navy shadow-lift transition duration-150 hover:-translate-y-0.5 hover:bg-slate-50 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"><LogIn size={18} /> Continue with Google</button>; }
export function SignOutButton() { return <button onClick={() => signOut({ callbackUrl: "/" })} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-crimson/30 hover:text-crimson active:scale-[0.97]"><LogOut size={16} /> Sign out</button>; }
