import { useAuth } from "@/context/authContext";
import { addressResumer } from "@/lib/utils";

interface UserNameProps {
  resumeAddressBy?: number;
}
const UserName: React.FC<UserNameProps> = ({
  resumeAddressBy,
}: UserNameProps) => {
  const { user, userType, userAddress } = useAuth();

  return (
    <>
      {user
        ? (user.user_metadata?.name ??
          (userType == "wallet" && userAddress
            ? resumeAddressBy
              ? addressResumer(userAddress, resumeAddressBy)
              : userAddress
            : user.email))
        : "User"}
    </>
  );
};

export default UserName;
