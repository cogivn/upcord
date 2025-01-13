const authImages = [
  {
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    alt: "Retro matrix code",
  },
];

export function getRandomAuthImage() {
  const randomIndex = Math.floor(Math.random() * authImages.length);
  return authImages[randomIndex];
}
