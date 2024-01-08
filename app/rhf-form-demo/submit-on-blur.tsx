import * as z from "zod"

import { Input } from "~/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Control, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { updatedDiff } from "deep-object-diff";
import deepEqual from "fast-deep-equal";


// We could just as easily have conditional fields in this form
const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }).max(10, {
        message: "Username must be at most 10 characters.",
    }),
    firstName: z.string().min(2, {
        message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
        message: "Last name must be at least 2 characters.",
    }),
})

type UserSchema = z.infer<typeof formSchema>

export function SubmitOnBlurForm() {

    // We treat this as server state that we get from a useQuery hook, and which would be updated with a useMutation hook
    const [userData, setUserData] = useState<UserSchema>({
        username: "user321",
        firstName: "Steve",
        lastName: "Stevenson",
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: userData,
        mode: "onChange",
    })


    function handleSubmit(values: UserSchema) {

        if (!deepEqual(values, userData)) {
            console.log("PATCH data", updatedDiff(userData, values))

            // Can also get the dirty fields from formState
            // Here we can confirm that the form actually uses the server state correctly to clear the dirty state
            console.log("dirty fields at submit", form.formState.dirtyFields)

            // For a PATCH, we'd set the diff instead
            setUserData(values)
        } else {
            console.log("No changes to save.")
        }
    }

    return (
        <Form {...form}>
            <form onBlur={form.handleSubmit(handleSubmit)} className="space-y-8">
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
                    <NameInputs
                        control={form.control}
                    />
                </div>
            </form>
        </Form>
    )
}

interface NameInputsProps {
    control: Control<UserSchema>,
}
function NameInputs({
    control,
}: NameInputsProps) {

    return (
        <>
            <FormField
                control={control}
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
                control={control}
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
        </>
    )
}