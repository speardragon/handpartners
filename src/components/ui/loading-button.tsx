import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";

type LoadingButtonProps = ButtonProps & {
  loading?: boolean;
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  function LoadingButton({ loading, children, ...props }, ref) {
    const { pending } = useFormStatus();

    const isLoading = loading ?? pending;

    return (
      <Button ref={ref} disabled={isLoading} {...props}>
        <>
          {isLoading ? "" : children}
          {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
