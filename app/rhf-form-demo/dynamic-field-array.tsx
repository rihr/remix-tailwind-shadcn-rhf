import * as z from "zod"

import { Input } from "~/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";

const wishlistSchema = z.array(
    z.object({
        text: z.string().min(4, {
            message: "Wishlist item must be at least 2 characters.",
        }),
        id: z.string(),
    })
).min(2)
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(10, {
        message: "Username must be at most 10 characters.",
    }),
    wishlist: wishlistSchema,
})


type FormSchema = z.infer<typeof formSchema>

// This is a useful example for cases with variable fields, and fields we retrieve from the server
// Especially useful for user-defined forms, like a form builder, or a form that can be configured by the user
export function DynamicFieldArray() {

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        values: {
            username: "user123",
            wishlist: [
                {
                    text: "Item 1",
                    id: "1",
                },
                {
                    text: "Item 2",
                    id: "2",
                }
            ],
        }
    })

    const {
        fields,
        append,
        // You can see how simple and comprehensive the API already is:
        // prepend,
        // remove,
        // swap,
        // move,
        // insert,
    } = useFieldArray({
        name: "wishlist",
        control: form.control,
    })


    function handleSubmit(values: FormSchema) {
        console.log("Submit data", values)
    }

    function handleAdd(amount: number) {
        const items = Array.from({ length: amount }, (_, i) => ({
            text: `Item ${i} - ${Math.random()}`,
            id: `${i}`,
        }))
        console.log(amount,)
        items.forEach(item => append(item))
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="user123" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    {
                        fields.map((field, index) => (
                            <FormField
                                key={index}
                                control={form.control}
                                name={`wishlist.${index}.text` as `wishlist.${number}.text`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item {index}</FormLabel>
                                        <FormControl>
                                            <Input placeholder={`Item ${index}`} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))
                    }
                    <Button type="submit">Submit</Button>
                </div>
            </form>
            {/*
            This also demonstrates performance, try adding 1000 fields, editing, submitting.
            Try to notice any issues. There may be some, but that case is also covered by the library with virtual list support:
            https://react-hook-form.com/advanced-usage#Workingwithvirtualizedlists
            */}
            <div className="flex gap-3 mt-6">
                <Button onClick={() => handleAdd(1)} variant={"outline"}>Add 1</Button>
                <Button onClick={() => handleAdd(10)} variant={"outline"}>Add 10</Button>
                <Button onClick={() => handleAdd(100)} variant={"outline"} >Add 100</Button>
            </div>
        </Form>
    )
}
