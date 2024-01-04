import { zodResolver } from "@hookform/resolvers/zod"
import { Control, UseFormRegister, UseFormUnregister, UseFormWatch, useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useEffect } from "react"


const formSchema = z.discriminatedUnion("attendeeType", [
    z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        attendeeType: z.literal("speaker"),
        affiliation: z.enum(["company", "private"]),
        orgName: z.optional(z.string().min(2, {
            message: "Company name must be at least 2 characters.",
        }).max(10, {
            message: "Company name must be at most 10 characters.",
        })),
    }),
    z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        attendeeType: z.literal("sponsor"),
    }),
    z.object({
        username: z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }),
        attendeeType: z.literal("attendee"),
    }),
]).refine(data => !(data.attendeeType === "speaker" && data.affiliation === "company") ||
                (data.attendeeType === "speaker" && data.affiliation === "company" && data.orgName), {
    message: "Company name is required for speakers",
    path: ["orgName"],
})

type AttendeeFormSchema = z.infer<typeof formSchema>

export function ProfileForm() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // Here we can simply pass the values we get from a useQuery hook, when we're editing server state
            username: "user123",
            orgName: "",
        },
        shouldUnregister: true,
    })

    // 2. Define a submit handler.
    function onSubmit(values: AttendeeFormSchema) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    // We can easily access all of form state, errors, touched, etc objects. Simple, predictable state
    // const formState = useFormState(form)
    // console.log(formState);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <AttendeeTypeInput control={form.control} />
                    <AffiliationInput
                        control={form.control}
                        register={form.register}
                        unregister={form.unregister}
                        watch={form.watch}
                    />
                    <OrgNameInput
                        control={form.control}
                        register={form.register}
                        unregister={form.unregister}
                        watch={form.watch}
                    />
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>

    )
}

interface AttendeeTypeInputProps {
    control: Control<AttendeeFormSchema>,
}
function AttendeeTypeInput({
    control,
}: AttendeeTypeInputProps) {

    const options = [
        {
            label: "Attendee",
            value: "attendee",
        },
        {
            label: "Speaker",
            value: "speaker",
        },
        {
            label: "Sponsor",
            value: "sponsor",
        }
    ]

    return (
        <div>
            <FormField
                control={control}
                name="attendeeType"
                render={({ field }) => (
                    <FormControl>
                        <FormItem>
                            <FormLabel>Attendee type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Attendee type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    </FormControl>
                )}
            />
        </div>

    )
}


interface AffiliationInputProps {
    control: Control<AttendeeFormSchema>,
    register: UseFormRegister<AttendeeFormSchema>,
    unregister: UseFormUnregister<AttendeeFormSchema>,
    watch: UseFormWatch<AttendeeFormSchema>,
}
function AffiliationInput({
    control,
    watch,
    register,
    unregister,
}: AffiliationInputProps) {

    // This is a dependent field on `affiliation` - it determines itself whether it is a part of the form and rendered
    // Another pattern where the top level form component detemines what fields are registered and rendered is just as easily possible
    const watchAttendeeType = watch("attendeeType");
    const isSpeaker = watchAttendeeType === "speaker"
    useEffect(() => {
        if (!isSpeaker) {
            unregister("affiliation")
        }
    }, [isSpeaker, register, unregister])

    if (!isSpeaker) {
        return null;
    }


    const options = [
        {
            label: "Company",
            value: "company",
        },
        {
            label: "Private",
            value: "private",
        }
    ]

    return (
        <div>
            <FormField
                control={control}
                name="affiliation"
                render={({ field }) => (
                    <FormControl>
                        <FormItem>
                            <FormLabel>Affiliation</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Affiliation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {options.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    </FormControl>
                )}
            />
        </div>
    )
}

interface OrgNameInputProps {
    control: Control<AttendeeFormSchema>,
    register: UseFormRegister<AttendeeFormSchema>,
    unregister: UseFormUnregister<AttendeeFormSchema>,
    watch: UseFormWatch<AttendeeFormSchema>,
}
function OrgNameInput({
    control,
    watch,
    register,
    unregister,
}: OrgNameInputProps) {

    // This is a second-tier conditional field

    // Another scenario - we want to conditionally change the input it watches - easily possible - just pass a different field key
    const watchAffiliation = watch("affiliation");
    const isCompany = watchAffiliation === "company"
    useEffect(() => {
        if (!isCompany) {
            unregister("orgName", { keepDefaultValue: true })
        }
    }, [isCompany, register, unregister])

    if (!isCompany) {
        return null;
    }

    return (
        <div>
            <FormField
                control={control}
                name="orgName"
                render={({ field }) => (
                    <FormControl>
                        <FormItem>
                            <FormLabel>Company name</FormLabel>
                            <FormControl>
                                <Input placeholder="Company A/S" {...field} />
                            </FormControl>
                            <FormDescription>
                                Company name
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    </FormControl>
                )}
            />
        </div>
    )
}