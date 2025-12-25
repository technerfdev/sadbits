import Typography from "@/components/Typography";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TimerDisplay from "@/modules/Pomodoro/TimerDisplay";
import { ThemeToggle } from "@/modules/Theme/ThemeToggle";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  BrainIcon,
  Home,
  ImagesIcon,
  Joystick,
  LightbulbIcon,
  ListTodoIcon,
  Settings2,
  SettingsIcon,
  SidebarIcon,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

import { type JSX } from "react/jsx-runtime";

const menu = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Work",
    url: "/work",
    icon: ListTodoIcon,
  },
  {
    title: "Vault",
    url: "/vault",
    icon: LightbulbIcon,
  },
  {
    title: "Image editor",
    url: "/img-editor",
    icon: ImagesIcon,
  },
  {
    title: "Relax",
    url: "relax",
    icon: Joystick,
  },
  {
    title: "Algorithm",
    url: "algorithm",
    icon: BrainIcon,
  },
];

function AppLayoutContainer(): JSX.Element {
  const { open, toggleSidebar } = useSidebar();
  const { pathname } = useLocation();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader className="pt-2">
          {open && (
            <SidebarMenu className="flex">
              <SidebarMenuItem className="ml-auto">
                <span className="sr-only">Toggle Close</span>
                <SidebarIcon
                  className="size-4 fade-in-5"
                  onClick={toggleSidebar}
                />
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>
        <SidebarContent className="pl-2 pr-2">
          <SidebarMenu aria-label="Menu">
            {menu.map((item) => (
              <SidebarMenuItem
                key={item.url}
                aria-label={item.title}
                className="flex justify-center"
              >
                <SidebarMenuButton asChild isActive={item.url === pathname}>
                  {open ? (
                    <Link to={item.url}>
                      <item.icon />
                      <span className={!open ? "sr-only" : ""}>
                        {item.title}
                      </span>
                    </Link>
                  ) : (
                    <Link to={item.url}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <item.icon />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <span>{item.title}</span>
                        </TooltipContent>
                      </Tooltip>
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {open ? (
                    <SidebarMenuButton className="justify-between">
                      {`{{USER_NAME}} and avatar`}
                      <Settings2 />
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton>
                      <SettingsIcon />
                    </SidebarMenuButton>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start" side="top">
                  <DropdownMenuItem className="p-2">
                    <Link to="/setting">
                      <Typography>Setting</Typography>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="relative min-h-screen w-full">
        <div className="pt-2 pl-1">
          {!open && <SidebarTrigger size="icon-lg" />}
        </div>
        <main className="container p-2 flex flex-col w-full">
          <Outlet />
        </main>
        <div className="absolute right-1 bottom-2">
          <ThemeToggle />
        </div>

        <TimerDisplay />
      </div>
    </>
  );
}

export default function AppLayout(): JSX.Element {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppLayoutContainer />
    </SidebarProvider>
  );
}
