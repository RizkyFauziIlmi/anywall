import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, SunDim, Moon, SlidersHorizontal } from "lucide-react";
import SidebarContent from "./sidebar-content";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import FilterComponent from "./filter-component";
import queryString from "query-string";

const formSchema = z.object({
  input: z.string().min(0, {
    message: "Input must be at least 2 characters.",
  }),
});

interface TopBarProps {
  isFullscreen?: boolean;
  isSearch?: boolean;
}

export default function TopBar({ isFullscreen, isSearch = true }: TopBarProps) {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (elementRef.current) {
      const elementHeight: number = elementRef.current.clientHeight;
      setHeight(elementHeight);
    }
  }, [elementRef]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("q") || "";
  let categories = queryParams.get("categories") || "";
  let aiFilter = queryParams.get("ai_art_filter") || 1;
  let sort = queryParams.get("sort") || "views";

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: query,
    },
  });

  const isDark = theme === "dark";

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
      return;
    }
    setTheme("dark");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const url = queryString.stringifyUrl({
      url: `/search`,
      query: {
        q: values.input,
        sort,
        page: 1,
        categories,
        ai_art_filter: aiFilter,
      },
    });
    console.log(url);
    navigate(url);
  };

  return (
    <div
      className={cn(
        scrollY >= 0 && scrollY < height - 50
          ? ""
          : scrollY >= 0 && scrollY < height - 40
          ? "translate-y-[-100%] duration-0"
          : scrollY >= height
          ? "sticky top-0 z-10 translate-y-0 duration-1000"
          : "translate-y-[-100%] duration-0",
        "transform transition ease-in-out bg-background"
      )}
    >
      <div
        className={cn(
          "p-2 flex justify-between gap-2 relative",
          isFullscreen ? "hidden" : ""
        )}
        ref={elementRef}
      >
        <SidebarContent />
        <div className="flex items-center justify-center gap-2">
          <Form {...form}>
            <form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div
                        className={cn("relative", !isSearch ? "hidden" : "")}
                      >
                        <Search className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-500 left-3" />
                        <Input
                          type="text"
                          {...field}
                          disabled={!isSearch}
                          className="outline-none bg-accent pl-12 pr-4 w-[40vw]"
                          placeholder="Search wallpaper..."
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <div className={cn("relative", !isSearch ? "hidden" : "")}>
            <Button size="icon" onClick={toggleCollapse} variant="ghost">
              <SlidersHorizontal />
            </Button>
          </div>
        </div>
        <Button onClick={toggleTheme} variant={"ghost"}>
          {isDark ? (
            <Moon className="h-4 w-4" />
          ) : (
            <SunDim className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "overflow-hidden transition-height duration-300 ease-in-out",
          isCollapsed ? "max-h-0" : "max-h-[500px]"
        )}
      >
        <FilterComponent />
      </div>
    </div>
  );
}
