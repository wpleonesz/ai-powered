import ProfilePhoto from '@ui/common/ProfilePhoto';

const ProfileLogo = ({ person }) => {
  // Asegurarse de que person siempre sea al menos un objeto vacío para prevenir errores
  const safePerson = person || {};
  return <ProfilePhoto person={safePerson} />;
};

export default ProfileLogo;
