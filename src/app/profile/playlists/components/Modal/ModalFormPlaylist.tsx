import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import type { Playlist } from "@/models/playlistSchema";

// Define the validation schema
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const formSchema = z.object({
  title: z.string().min(3, {
    message: "El titulo debe tener al menos 3 caracteres",
  }),
  description: z.string().min(3, {
    message: "La descripcion debe tener al menos 3 caracteres",
  }),
  cover: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => (file ? file.size <= MAX_FILE_SIZE : true),
      "Max file size is 5MB."
    )
    .refine(
      (file) => (file ? ACCEPTED_FILE_TYPES.includes(file.type) : true),
      "Only .jpg, .jpeg, .png files are accepted."
    ),
});

export function ModalFormPlaylist({
  handler,
  isModalOpen,
  setIsModalOpen,
}: {
  handler: (playlist: Playlist) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      cover: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    fetch("/api/profile/playlists", {
      method: "POST",
      body: JSON.stringify({
        ...values,
      }),
    }).then(async (res) => {
      const req = (await res.json()).data;

      console.log("form submitted", req);
      handler({
        _id: req._id,
        username: req.username,
        title: req.title,
        cover: req.cover,
        description: req.description,
        songs: [],
      });
      form.reset();

      setIsModalOpen(false);
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild key="dialog-trigger">
        <Button variant="outline">Crear Playlist</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" key="dialog-content">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem key="title">
                  <FormLabel>titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="titulo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem key="description">
                  <FormLabel>Descripcion</FormLabel>
                  <FormControl>
                    <Textarea placeholder="description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cover"
              render={({ field }) => (
                <FormItem key="cover">
                  <FormLabel>Cover</FormLabel>
                  <FormControl>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          field.onChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant={"outline"} className="w-full" type="submit">
              Crear
            </Button>
          </form>
        </Form>
        <DialogClose asChild key="dialog-close">
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
