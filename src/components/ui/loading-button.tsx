import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

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
          {/*
           * 로딩 중에도 children을 언마운트하지 않고 숨기기만 한다.
           * 브라우저 번역(구글 번역 등)이 텍스트 노드를 <font>로 교체한 상태에서
           * React가 텍스트 노드를 제거하면 removeChild NotFoundError로 앱 전체가 깨진다.
           * display: contents로 감싸 기존 flex 배치(gap 등)는 그대로 유지한다.
           */}
          <span className={cn("contents", isLoading && "hidden")}>
            {children}
          </span>
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </>
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
