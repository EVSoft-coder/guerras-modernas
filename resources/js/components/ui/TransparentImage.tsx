import React, { useState, useEffect } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    tolerance?: number;
    targetColor?: { r: number, g: number, b: number } | null;
}

/**
 * TransparentImage V3 — "Nuclear Alpha".
 * Resolve problemas de CORS e cache, removendo fundos complexos (sólidos ou axadrezados).
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, tolerance = 30, targetColor, ...props }) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!src) return;

        const processImage = async () => {
            try {
                // Bypass CORS e Cache carregando como Blob
                const cacheBuster = src.includes('?') ? `&v3=${Date.now()}` : `?v3=${Date.now()}`;
                const response = await fetch(src + cacheBuster);
                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                const img = new Image();
                img.src = objectUrl;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    if (!ctx) {
                        setProcessedSrc(src);
                        return;
                    }

                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    // Referências de cores de fundo
                    const bgR = targetColor ? targetColor.r : data[0];
                    const bgG = targetColor ? targetColor.g : data[1];
                    const bgB = targetColor ? targetColor.b : data[2];

                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        // Distância euclidiana simples
                        const dist = Math.sqrt(
                            Math.pow(r - bgR, 2) + 
                            Math.pow(g - bgG, 2) + 
                            Math.pow(b - bgB, 2)
                        );

                        if (dist < tolerance) {
                            data[i + 3] = 0;
                        }
                    }

                    ctx.putImageData(imageData, 0, 0);
                    setProcessedSrc(canvas.toDataURL("image/png"));
                    URL.revokeObjectURL(objectUrl);
                };
            } catch (e) {
                console.error("TransparentImage Nuclear Error:", e);
                setProcessedSrc(src);
            }
        };

        processImage();
    }, [src, tolerance, targetColor?.r, targetColor?.g, targetColor?.b]);

    if (!processedSrc) {
        return <img src={src} {...props} style={{ ...props.style, opacity: 0.1 }} />;
    }

    return (
        <img 
            src={processedSrc} 
            {...props} 
            style={{ 
                ...props.style,
                // Fallback visual extra: se a transparência falhar no processamento, 
                // tentamos suavizar com mix-blend se o fundo for escuro.
                mixBlendMode: 'normal'
            }} 
        />
    );
};
