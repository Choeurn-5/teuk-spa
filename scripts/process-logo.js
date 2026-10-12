const sharp = require('sharp');
const path = require('path');

async function processLogo() {
  const { data, info } = await sharp('public/uploads/logo.jpg')
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  
  // Create RGBA buffer (4 channels)
  const rgba = Buffer.alloc(width * height * 4);

  let minX = width, maxX = 0, minY = height, maxY = 0;

  // Thresholds for the checkerboard:
  // The checkerboard greys are around 88 and 120. With JPEG artifacts they peak under 140.
  // The white text is > 200, reaching 255.
  const lowerThreshold = 145; // Below this is 100% background
  const upperThreshold = 230; // Above this is 100% solid white

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 3;
      const dstIdx = (y * width + x) * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      // Luminance
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      if (lum <= lowerThreshold) {
        rgba[dstIdx] = 255;
        rgba[dstIdx + 1] = 255;
        rgba[dstIdx + 2] = 255;
        rgba[dstIdx + 3] = 0; // Transparent
      } else if (lum >= upperThreshold) {
        rgba[dstIdx] = 255;
        rgba[dstIdx + 1] = 255;
        rgba[dstIdx + 2] = 255;
        rgba[dstIdx + 3] = 255; // Fully opaque white

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        // Smooth anti-aliased edge
        const t = (lum - lowerThreshold) / (upperThreshold - lowerThreshold);
        const alpha = Math.round(t * 255);

        rgba[dstIdx] = 255;
        rgba[dstIdx + 1] = 255;
        rgba[dstIdx + 2] = 255;
        rgba[dstIdx + 3] = alpha;

        if (alpha > 30) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
  }

  console.log(`Text bounding box: x=[${minX}, ${maxX}], y=[${minY}, ${maxY}]`);
  const bboxWidth = maxX - minX + 1;
  const bboxHeight = maxY - minY + 1;
  console.log(`Bounding size: ${bboxWidth} x ${bboxHeight}`);

  // 1. Save trimmed transparent PNG to public/images/logo.png and public/uploads/logo.png
  const pad = 40;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(width - cropX, bboxWidth + pad * 2);
  const cropH = Math.min(height - cropY, bboxHeight + pad * 2);

  await sharp(rgba, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toFile('public/images/logo.png');

  // Also generate olive dark version (RGB: 74, 82, 64) for light backgrounds
  const rgbaDark = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const alpha = rgba[i * 4 + 3];
    rgbaDark[i * 4] = 74;      // R
    rgbaDark[i * 4 + 1] = 82;  // G
    rgbaDark[i * 4 + 2] = 64;  // B
    rgbaDark[i * 4 + 3] = alpha;
  }

  await sharp(rgbaDark, {
    raw: { width, height, channels: 4 }
  })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png({ compressionLevel: 9 })
    .toFile('public/images/logo-dark.png');

  await sharp('public/images/logo-dark.png')
    .toFile('public/uploads/logo-dark.png');

  console.log(`Saved transparent trimmed logo to:
- public/images/logo.png (${cropW}x${cropH}) [Pure White]
- public/uploads/logo.png (${cropW}x${cropH}) [Pure White]
- public/images/logo-dark.png (${cropW}x${cropH}) [Olive #4A5240]
- public/uploads/logo-dark.png (${cropW}x${cropH}) [Olive #4A5240]`);
}

processLogo().catch(console.error);
