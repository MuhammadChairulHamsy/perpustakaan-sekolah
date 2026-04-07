import { ProfileDeleteAccount } from "../components/profile/ProfileDeleteAccount";
import { ProfileFormChangePassword } from "../components/profile/ProfileFormChangePassword";
import { ProfileFormInformation } from "../components/profile/ProfileFormInformation";
import { ProfilePicture } from "../components/profile/ProfilePicture";

const ProfileAccount = () => {
  return (
    <div className="container min-h-screen space-y-6">
      <div className="flex flex-col justify-between items-center lg:flex lg:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Pengaturan Akun
          </h1>
          <p className="text-muted-foreground">
            Kelola profil dan preferensi keamanan Anda
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="space-y-6">
          <ProfilePicture />
          <ProfileDeleteAccount/>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          <ProfileFormInformation />
          <ProfileFormChangePassword />
        </div>
      </div>
    </div>
  );
};
export default ProfileAccount;
