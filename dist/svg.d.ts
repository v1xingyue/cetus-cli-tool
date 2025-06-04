type IconOptions = {
    width?: number;
    height?: number;
    fontColor?: string;
    fontFamily?: string;
    backgroundColors?: string[];
};
export declare function generateTokenIconSVG(text: string, options?: IconOptions): string;
export declare function svgToBase64(svg: string): string;
export {};
