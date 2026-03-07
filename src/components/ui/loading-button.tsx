import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton({ loading, disabled, children, ...props }, ref) {
    const { pending } = useFormStatus();

    const isLoading = loading ?? pending;

    return (
      <Button ref={ref} disabled={isLoading || disabled} {...props}>
        <>
          {isLoading ? "" : children}
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
