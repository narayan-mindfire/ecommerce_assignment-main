export const hexToRgba = (hex: string, alpha: number) => {
    console.log("got hex",hex)
    if (hex.startsWith("rgba") || hex.startsWith("rgb")) {
      return hex.replace(/[\d\.]+\)$/g, `${alpha})`);
    }
    let r, g, b;
  
    if (hex.length === 7) {
      // #RRGGBB format
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    } else if (hex.length === 4) {
      // #RGB format (shorthand)
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    }
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  