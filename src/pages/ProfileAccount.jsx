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
        <ProfilePicture />
    </div>
  );
};
export default ProfileAccount;
