import * as z from "zod"
import { useState } from "react"

import { Input } from "~/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { Control, FieldPathValue, FieldValues, Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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

export function ComposableForm2() {

    // We treat this as server state that we get from a useQuery hook, and which would be updated with a useMutation hook
    const [userData, setUserData] = useState<UserSchema>({
        username: "user321",
        names: {
            firstName: "Steve",
            lastName: "Stevenson",
        },
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: userData,
        mode: "onChange",
    })

    // Lazy proof of concept.
    // This path map could easily be generated
    const pathMap: FieldPathValue<UserSchema, "names"> = {
        firstName: "names.firstName",
        lastName: "names.lastName",
    }

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
                    <NameInputs control={form.control} paths={pathMap} />
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

type NameSchema = z.infer<typeof nameSchema>
interface NameInputsProps<T extends FieldValues> {
    control: Control<T>,
    paths: NameSchema,
}
function NameInputs<T extends FieldValues>({
    control,
    paths,
}: NameInputsProps<T>) {

    // Not perfect - there must be a way to properly map the field paths, but likely will require a 'namespace' prop
    const mappedPaths = paths as Record<keyof NameSchema, Path<NameSchema>>;
    const mappedControl = control as FieldValues as Control<NameSchema>;

    return (
        <>
                <FormField
                    control={mappedControl}
                    name={mappedPaths.firstName}
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
                    control={mappedControl}
                    name={mappedPaths.lastName}
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

// interface ComposedFormProps<T> {
//     values: T
//     children: React.ReactElement
//     onSubmit: (values: T) => void
// }
// function ComposedForm<T extends FieldValues>({
//     values,
//     children,
//     onSubmit
// }:ComposedFormProps<T>) {
//     const methods = useForm({ values })
//     const { handleSubmit } = methods
  
//     return (
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {React.Children.map(children, (child) => {
//           return child.props.name
//             ? React.createElement(child.type, {
//                 ...{
//                   ...child.props,
//                   register: methods.register,
//                   control: methods.control,
//                   key: child.props.name,
//                 },
//               })
//             : child
//         })}
//       </form>
//     )
//   }

