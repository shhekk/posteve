interface platFom {
  title: string;
  key: string;
  logo: string;
  style: React.CSSProperties;
}
const imageStyle = {
  width: 70,
  height: 70,
  // borderRadius: '1rem',
};

export const PlatForms: platFom[] = [
  {
    title: 'Linkedin',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png',
    key: 'linkedin-logo',
    style: imageStyle,
  },
  {
    // title: 'Twitter',
    title: 'X',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg',
    key: 'twitter-logo',
    style: imageStyle,
  },
  {
    title: 'Instagram',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg',
    key: 'instagram-logo',
    style: imageStyle,
  },
  {
    title: 'Facebook',
    // logo: '/full-logo.webp',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Facebook_Logo_2023.png',
    key: 'facebook-logo',
    style: imageStyle,
  },
  {
    title: 'Linkedin Page',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/1200px-LinkedIn_icon.svg.png',
    key: 'linkedin-page-logo',
    style: imageStyle,
  },
];
