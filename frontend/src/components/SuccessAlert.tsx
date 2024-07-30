import { CircleCheckBig } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SuccessAlertProps {
  successMessage: string;
  link?: string;
}

export function SuccessAlert({ successMessage, link }: SuccessAlertProps) {
  return (
    <Alert variant="success">
      <CircleCheckBig className="h-4 w-4 text-green-700" />
      <AlertTitle className="text-green-700">Success</AlertTitle>
      <AlertDescription className="text-green-700">
        {`${successMessage} `}
        {
          link &&
          <a className="hover:underline" href={link} target="_blank">Click here to view your post!</a>
        }
      </AlertDescription>
    </Alert>
  );
}
