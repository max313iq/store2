import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Schema for form validation using Zod
const formSchema = z.object({
  email: z.string().email({
    message: "الرجاء إدخال بريد إلكتروني صالح.",
  }),
  password: z.string().min(8, {
    message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
  }),
});

// The setOpen function is passed as a prop to close the dialog on success
export function LoginForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // POST request to the backend login endpoint
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        values
      );

      if (response.data.status === "success") {
        toast({
          title: "تم تسجيل الدخول بنجاح!",
          description: "أهلاً بعودتك.",
        });
        // Here you would typically save the token and update the app state
        // For example: localStorage.setItem('token', response.data.token);
        console.log("Token:", response.data.token);
        setOpen(false); // Close the dialog
      }
    } catch (error: any) {
      toast({
        title: "فشل تسجيل الدخول",
        description:
          error.response?.data?.message ||
          "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          تسجيل الدخول
        </Button>
      </form>
    </Form>
  );
}
