const stringToBlob = (base64: string): Blob => {
  const binaryString = atob(base64);
  const arrayBuffer = Uint8Array.from(binaryString, (char) =>
    char.charCodeAt(0)
  ).buffer;
  return new Blob([arrayBuffer]);
};

export default stringToBlob;
