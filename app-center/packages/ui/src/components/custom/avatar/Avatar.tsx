import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";

interface Props {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export const AvatarComponent = ({ src, alt, fallback, className }: Props) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
};
