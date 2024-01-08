import * as z from "zod"

import { Input } from "~/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "~/components/ui/button";

// This schema could be "owned" and exported by the NameInputs composable form
const nameSchema = z.object({
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
})


const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(10, {
        message: "Username must be at most 10 characters.",
    }),
    names: nameSchema, // The root form still validtes the nested form with the exact same schema
})


type UserSchema = z.infer<typeof formSchema>

export function ComposableForm() {

    // We treat this as server state that we get from a useQuery hook, and which would be updated with a useMutation hook
    const [userData, setUserData] = useState<UserSchema>({
        username: "user321",
        names: {
            firstName: "Steve",
            lastName: "Stevenson",
        },
    })

    // console.log("userData", userData)

    const form = useForm<UserSchema>({
        resolver: zodResolver(formSchema),
        values: userData,
        mode: "onSubmit",
    })


    function handleSubmit(values: UserSchema) {
        console.log("Submit data", values)
        setUserData(values)
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
                    <FormField
                        control={form.control}
                        name="names"
                        render={({ field }) => {
                            return (
                                <NameInputs value={field.value} onChange={field.onChange} />
                            )
                        }}
                    />
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

// This is one way of doing it. There are also ways of having one form instance
// Having multiple form instances can make sense when there are components such as drawers, that are semantically and often in practice separate, mostly independant forms

// NameInputs is composable, it can be safely re-used in other form instances
// It can export its own validation schema
type NameSchema = z.infer<typeof nameSchema>
interface NameInputsProps {
    value: NameSchema
    onChange: (values: NameSchema) => void
}
function NameInputs({
    value,
    onChange,
}: NameInputsProps) {

    const form = useForm<NameSchema>({
        resolver: zodResolver(nameSchema),
        values: value, // By using the values prop, the parent form still controls the values - it holds the state source of truth
        mode: "onTouched",
    })

    const handleSubmit = () => {
        onChange(form.getValues())
    }


    // Note that we don't necessarily need to have the form DOM element for a form instance
    return (
        <Form {...form}>
            <div onBlur={handleSubmit}>
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First name</FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last name</FormLabel>
                            <FormControl>
                                <Input placeholder="Smith" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Form>
    )
}