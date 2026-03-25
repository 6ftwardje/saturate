"use client";

export function ConfirmSubmit({
  message,
  children,
  className,
  ...props
}: React.ComponentProps<"form"> & { message: string }) {
  return (
    <form
      {...props}
      className={className}
      onSubmit={(e) => {
        if (typeof window !== "undefined" && !window.confirm(message)) {
          e.preventDefault();
        }
        props.onSubmit?.(e);
      }}
    >
      {children}
    </form>
  );
}
