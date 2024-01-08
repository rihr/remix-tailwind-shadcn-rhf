
import { ModeToggle } from "~/components/mode-toggle"
import { ConditionalForm } from "./conditional"
import { SubmitOnBlurForm } from "./submit-on-blur"
import { ComposableForm } from "./composable"
import { DynamicFieldArray } from "./dynamic-field-array"


export function FormDemo() {
    return (
        <div className="grid grid-cols-4 gap-4 m-5">
            <div className="prose dark:prose-invert">
                <h2>Click to submit with conditional field</h2>
                <ConditionalForm />
            </div>
            <div className="prose dark:prose-invert">
                <h2>Submit form on blur</h2>
                <SubmitOnBlurForm />
            </div>
            <div className="prose dark:prose-invert">
                <h2>Form and schema composition</h2>
                <ComposableForm />
            </div>
            <div className="prose dark:prose-invert">
                <h2>Field array</h2>
                <DynamicFieldArray />
            </div>
            <ModeToggle />
        </div>
    )
}
