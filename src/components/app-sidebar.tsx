import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarFooter,
    SidebarSeparator,
  } from "@/components/ui/sidebar";
import { ListPlus, School, Folder, FileText, GraduationCap, User, LogOut, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        <SidebarGroup>
          <SidebarGroupLabel>Fakülteler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <School className="mr-2 h-4 w-4" />
                  <span>Fakülte</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/faculties">
                        <School className="mr-2 h-4 w-4" />
                        <span>Tüm Fakülteler</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/faculties/create-faculty">
                        <ListPlus className="mr-2 h-4 w-4" />
                        <span>Fakülte Oluştur</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Bölümler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Bölüm</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/departments">
                        <GraduationCap className="mr-2 h-4 w-4" />
                        <span>Tüm Bölümler</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>

                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/departments/create-department">
                        <ListPlus className="mr-2 h-4 w-4" />
                        <span>Bölüm Oluştur</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Proje</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Folder className="mr-2 h-4 w-4" />
                  <span>Projeler</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="/dashboard/projects/create">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Create Project</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <div className="flex flex-col gap-2 p-4">
          {mounted && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  <span>Açık Tema</span>
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  <span>Koyu Tema</span>
                </>
              )}
            </Button>
          )}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <span>{session.user.name || "Kullanıcı"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" alignOffset={-20}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{session.user.name || "Kullanıcı"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="purple" className="w-full">
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Giriş Yap
              </Link>
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
