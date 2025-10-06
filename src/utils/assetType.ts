export const assetType = (url: string | undefined) => {
  const formats = new Map([
    ["jpg", "image"],
    ["jpeg", "image"],
    ["png", "image"],
    ["gif", "image"],
    ["bmp", "image"],
    ["webp", "image"],
    ["svg", "image"],
    ["mp4", "video"],
    ["mpeg", "video"],
    ["webm", "video"],
    ["mkv", "video"],
  ]);

  if (url && !!url.trim()) {
    let splitted_url = url.split(".");
    let extension = splitted_url[splitted_url.length - 1];
    let type = formats.get(extension);
    return type;
  }

  return null;
};
