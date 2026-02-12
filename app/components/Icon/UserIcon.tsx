import Image from "next/image";
import { LuUser } from "react-icons/lu";

export type UserIconProps = {
  source: string | null;
  size?: number;
};

export function ProfileUser({ source, size = 16 }: UserIconProps) {
  return (
    <div className={`w-${size} h-${size}`}>
      {source ? (
        <Image
          src={source}
          alt="User Avatar"
          width={size}
          height={size}
          className="rounded-full object-cover w-full h-full"
        />
      ) : (
        <div
          className={`w-full h-full bg-gray-300 rounded-full flex justify-center items-center`}
        >
          <LuUser className="text-2xl" />
        </div>
      )}
    </div>
  );
}

export function UserIcon() {
  return (
    <div className="w-10 h-10 bg-gray-300 rounded-full flex justify-center items-center">
      <LuUser className="text-2xl" />
    </div>
  );
}
