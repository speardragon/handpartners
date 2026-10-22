declare module "*.png" {
  const value: import("next/image").StaticImageData;
  export default value;
}
