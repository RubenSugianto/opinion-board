import { useFormStatus } from "react-dom";

export default function Submit() {

    // balikan dari useFormStatus itu ada 4 yaitu pending, data, method, action
    // bisa diliat langsung dari dokumentasi react
    const { pending } = useFormStatus();

    return (
        <p className="actions">
            <button type="submit" disabled={pending}>
                {pending ? 'Submitting...' : 'Submit'}
            </button>
        </p>
    );
}