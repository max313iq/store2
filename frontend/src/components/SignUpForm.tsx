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
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "يجب أن يتكون الاسم من حرفين على الأقل.",
    }),
    email: z.string().email({
      message: "الرجاء إدخال بريد إلكتروني صالح.",
    }),
    password: z.string().min(8, {
      message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["passwordConfirm"],
  });

// The setOpen function is passed as a prop to close the dialog on success
export function SignUpForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // POST request to the backend signup endpoint
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/signup",
        values
      );

      if (response.data.status === "success") {
        toast({
          title: "تم إنشاء الحساب بنجاح!",
          description: "يمكنك الآن تسجيل الدخول.",
        });
        setOpen(false); // Close the dialog
      }
    } catch (error: any) {
      toast({
        title: "حدث خطأ ما!",
        description:
          error.response?.data?.message ||
          "كانت هناك مشكلة في طلبك. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder="اسمك الكامل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          إنشاء حساب
        </Button>
      </form>
    </Form>
  );
}
