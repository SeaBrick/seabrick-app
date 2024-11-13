import Image from "next/image";
import React from "react";

interface UserProfileProps {
  width: number;
  height: number;
  alt?: string;
  className?: string;
}
export const UserProfile: React.FC<UserProfileProps> = ({
  width,
  height,
  className = "hidden md:block",
  alt = "User photo",
}) => {
  return (
    <Image
      className={className}
      src="/user-no-profile.webp"
      alt={alt}
      width={width}
      height={height}
    />
  );
};
