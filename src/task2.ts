type RGBColor = [number, number, number];

enum ColorName {
  Red,
  Green,
  Blue
}

function rgbToHex(color: RGBColor): string {
  const [r, g, b] = color;

  const isValidChannel = (c: number) => Number.isInteger(c) && c >= 0 && c <= 255;
  if (!isValidChannel(r) || !isValidChannel(g) || !isValidChannel(b)) {
    throw new RangeError(`Некорректный RGB: [${r}, ${g}, ${b}]. Значения должны быть целыми от 0 до 255.`);
  }

  const toHex = (c: number) => c.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getColorInfo(name: ColorName): { rgb: RGBColor; hex: string } {
  let rgb: RGBColor;
  switch (name) {
    case ColorName.Red: rgb = [255, 0, 0]; break;
    case ColorName.Green: rgb = [0, 255, 0]; break;
    case ColorName.Blue: rgb = [0, 0, 255]; break;
  }
  return { rgb, hex: rgbToHex(rgb) };
}

console.log('\n--- Задача 2 ---');
console.log('Red:', getColorInfo(ColorName.Red));
console.log('Green:', getColorInfo(ColorName.Green));
console.log('Blue:', getColorInfo(ColorName.Blue));

try {
    rgbToHex([256, -5, 100]);
  } catch (e) {
    if (e instanceof RangeError) {
      console.log('Ожидаемая ошибка:', e.message);
    }
  }

export {};