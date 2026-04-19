"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  Package,
  Phone,
  ShoppingCart,
  Target,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/admin/vendas", label: "Vendas", icon: ShoppingCart },
  { href: "/admin/metricas", label: "Métricas", icon: Phone },
  { href: "/admin/meta", label: "Meta", icon: Target },
  { href: "/admin/times", label: "Times", icon: Users },
  { href: "/admin/closers", label: "Closers", icon: User },
  { href: "/admin/produtos", label: "Produtos", icon: Package },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-6 p-4">
      <Link
        href="/admin/vendas"
        onClick={onNavigate}
        className="px-2 py-1 font-rajdhani text-xl font-bold tracking-wide text-white"
      >
        Dash Comercial
      </Link>

      <ul className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-bg-cardSoft hover:text-white",
                  active &&
                    "border-accent-gold bg-bg-cardSoft text-white"
                )}
              >
                <Icon className="size-4" aria-hidden />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

interface AdminSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AdminSidebar({ open: openProp, onOpenChange }: AdminSidebarProps = {}) {
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = openProp ?? uncontrolled;
  const setOpen = onOpenChange ?? setUncontrolled;
  const controlled = openProp !== undefined;

  return (
    <>
      <aside
        className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:w-[240px] lg:flex-col lg:border-r lg:border-border-card lg:bg-bg-card"
        aria-label="Navegação admin"
      >
        <SidebarContent />
      </aside>

      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          {controlled ? null : (
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menu"
                className="fixed left-3 top-3 z-30"
              >
                <Menu className="size-5" aria-hidden />
              </Button>
            </SheetTrigger>
          )}
          <SheetContent
            side="left"
            className="w-[240px] border-border-card bg-bg-card p-0"
          >
            <SidebarContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
