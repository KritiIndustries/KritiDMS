// GlobalAlert.jsx
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, AlertDialogTitle, AlertDialogAction } from "../components/ui/alert-dialog";

export default function GlobalAlert({ show, message, close }) {
    return (
        <AlertDialog open={show}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{message.title}</AlertDialogTitle>
                    <AlertDialogDescription>{message.message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={close}>
                        {message.continueLabel || "OK"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
