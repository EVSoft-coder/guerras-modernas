import React, { useState, useEffect, useRef } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    removeColor?: { r: number, g: number, b: number, tolerance?: number };
}

/**
 * TransparentImage — Motor de Transparência Dinâmica V1.
 * Remove fundos sólidos de imagens via Canvas API em tempo real.
 * Útil para assets gerados por IA que vêm com "caixas" de cor.
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, removeColor, ...props }) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                setProcessedSrc(src);
                return;
            }

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Se não especificarmos cor, tentamos detetar o pixel do canto superior esquerdo
            const targetR = removeColor?.r ?? data[0];
            const targetG = removeColor?.g ?? data[1];
            const targetB = removeColor?.b ?? data[2];
            const tolerance = removeColor?.tolerance ?? 30;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Cálculo de distância de cor simples
                const diff = Math.sqrt(
                    Math.pow(r - targetR, 2) + 
                    Math.pow(g - targetG, 2) + 
                    Math.pow(b - targetB, 2)
                );

                if (diff < tolerance) {
                    data[i + 3] = 0; // Set alpha to 0
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setProcessedSrc(canvas.toDataURL());
        };

        img.onerror = () => {
            setProcessedSrc(src);
        };
    }, [src, removeColor]);

    if (!processedSrc) return <img src={src} {...props} style={{ ...props.style, opacity: 0 }} />;

    return <img src={processedSrc} {...props} />;
};
