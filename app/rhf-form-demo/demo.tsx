
import { ModeToggle } from "~/components/mode-toggle"
import { ProfileForm } from "./conditional"


export function Form() {
    return (
        <div className="grid grid-cols-4 gap-4 m-5">
            <div className="prose dark:prose-invert">
                <h2>Click to submit with conditional field</h2>
                <ProfileForm />
            </div>
            <div className="prose dark:prose-invert">
                <h2>Submit field on blur</h2>
            </div>
            <div className="prose dark:prose-invert">
                <h2>Form and schema composition</h2>
            </div>
            <div className="prose dark:prose-invert">
                <h2>Field array</h2>
            </div>
            <ModeToggle />
        </div>
    )
}
