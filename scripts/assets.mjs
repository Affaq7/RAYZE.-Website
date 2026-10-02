import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
const mark = sharp("logos/mark-red.png");
console.log("Supplied mark:", await mark.metadata());
await mark
  .clone()
  .resize(64, 64, { fit: "contain", background: "#0a0a0a" })
  .png()
  .toFile("public/icon.png");
await mark
  .clone()
  .resize(180, 180, { fit: "contain", background: "#0a0a0a" })
  .png()
  .toFile("public/apple-icon.png");
const logo = await mark
  .clone()
  .resize(310, 310, { fit: "contain", background: "#0a0a0a" })
  .png()
  .toBuffer();
const type = Buffer.from(
  '<svg width="1200" height="630"><text x="75" y="245" fill="white" font-family="Arial" font-size="108" font-weight="900">RISE WITH</text><text x="75" y="370" fill="#e8241a" font-family="Arial" font-size="132" font-weight="900">RAYZE.</text><text x="80" y="520" fill="#9a9a9a" font-family="Arial" font-size="22">BRAND / CONTENT / DIGITAL</text></svg>',
);
await sharp({
  create: { width: 1200, height: 630, channels: 4, background: "#0a0a0a" },
})
  .composite([{ input: logo, left: 830, top: 140 }, { input: type }])
  .png()
  .toFile("public/images/social.png");
