import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Home, BookCheck } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Chatbot",
      url: "/chat",
      icon: User,
    },
    {
      title: "Ongoing Job Applications",
      url: "/jobs",
      icon: BookCheck,
    },
  ]
   
  export function AppSidebar() {
    const pathname = usePathname();

    return (
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex flex-col items-center pt-6 mb-32">
              <Image
                src="/logo.png"
                alt="Sidebar Logo"
                width={80}
                height={80}
                className="object-contain mb-2"
              />
              <span className="text-lg font-semibold self-start">Sidebar</span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild data-active={active ? "true" : undefined}>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }