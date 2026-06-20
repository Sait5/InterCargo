export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const preloadImages = (imagePaths) => {
  return Promise.all(imagePaths.map(path => loadImage(path).catch(() => null)));
};