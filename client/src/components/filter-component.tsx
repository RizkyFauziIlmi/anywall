import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";

const categories = [
  {
    id: "general",
    label: "General",
  },
  {
    id: "anime",
    label: "Anime",
  },
  {
    id: "people",
    label: "People",
  },
] as const;

const FormSchema = z.object({
  categories: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one category.",
    }),
  sort: z.string({ required_error: "Please pick one sorting method!" }),
  aiFilter: z.boolean()
});

export default function FilterComponent() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  let query = queryParams.get("q") || "";
  let categoriesUrl = queryParams.get("categories") || "";
  const categoriesString = categoriesUrl.toString();
  let sort = queryParams.get("sort") || "views";
  let aiFilter = queryParams.get("ai_art_filter") || 1;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categories:
        categoriesString !== ""
          ? categoriesString.split(",")
          : ["general", "anime"],
      sort,
      aiFilter: aiFilter == 0 ? true : false,
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const url = queryString.stringifyUrl({
      url: `/search`,
      query: {
        q: query,
        sort: data.sort || sort,
        page: 1,
        categories: data.categories.join(","),
        ai_art_filter: data.aiFilter ? 0 : 1,
      },
    });

    navigate(url);
  };

  return (
    <div className="w-screen flex justify-center items-center">
      <Form {...form}>
        <form
          className="flex justify-center items-center p-4 gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-5">
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Categories</FormLabel>
                    <FormDescription></FormDescription>
                  </div>
                  {categories.map((category) => (
                    <FormField
                      key={category.id}
                      control={form.control}
                      name="categories"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={category.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        category.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== category.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {category.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Sorting Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="views">views</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="date_added">Date Added</SelectItem>
                      <SelectItem value="favorites">Favorites</SelectItem>
                      <SelectItem value="toplist">Top List</SelectItem>
                      <SelectItem value="hot">Hot</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="aiFilter"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base">AI Filter</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">Apply</Button>
        </form>
      </Form>
    </div>
  );
}
