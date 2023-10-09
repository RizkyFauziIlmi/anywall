import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, SunDim, Moon } from "lucide-react";
import SidebarContent from "./sidebar-content";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  input: z.string().min(0, {
    message: "Input must be at least 2 characters.",
  })
})

interface TopBarProps {
  isFullscreen?: boolean
}

export default function TopBar({ isFullscreen }: TopBarProps) {
  const { setTheme, theme } = useTheme();
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      input: ""
    }
  })

  const isDark = theme === "dark";

  const toggleTheme = () => {
    if (isDark) {
      setTheme("light");
      return;
    }
    setTheme("dark");
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    navigate(`/search?query=${values.input}`);
  }

  return (
    <div className={cn("p-2 flex justify-between gap-2", isFullscreen ? "hidden" : "")}>
      <SidebarContent />
      <Form {...form}>
        <form className="flex gap-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute top-0 bottom-0 w-4 h-4 my-auto text-gray-500 left-3" />
                    <Input
                      type="text"
                      {...field}
                      className="pl-12 pr-4 w-[40vw]"
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
      <Button onClick={toggleTheme} variant={"ghost"}>
        {isDark ? <Moon className="h-4 w-4" /> : <SunDim className="h-4 w-4" />}
      </Button>
    </div>
  );
}
