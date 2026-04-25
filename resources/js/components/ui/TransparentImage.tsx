import React, { useState, useEffect, useRef } from 'react';

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    tolerance?: number;
}

/**
 * TransparentImage V2 — "Smart Alpha".
 * Deteta e remove fundos sólidos ou axadrezados de assets gerados por IA.
 * Utiliza o pixel (0,0) como referência e analisa a vizinhança.
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, tolerance = 60, ...props }) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        // Forçamos o recarregamento ignorando a cache se necessário, 
        // mas aqui usamos crossOrigin para o canvas.
        img.crossOrigin = "anonymous";
        
        // Adicionamos um timestamp para evitar cache agressiva do browser
        const cacheBuster = src.includes('?') ? `&v=${Date.now()}` : `?v=${Date.now()}`;
        img.src = src + cacheBuster;
        
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

            // Amostragem de cor de fundo (usamos a média dos 4 cantos para ser mais robusto)
            const corners = [
                { r: data[0], g: data[1], b: data[2] }, // Top-left
                { r: data[(canvas.width - 1) * 4], g: data[(canvas.width - 1) * 4 + 1], b: data[(canvas.width - 1) * 4 + 2] }, // Top-right
                { r: data[data.length - 4], g: data[data.length - 3], b: data[data.length - 2] } // Bottom-right
            ];

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Verificamos se o pixel se assemelha a qualquer um dos cantos
                let isBackground = false;
                for (const corner of corners) {
                    const diff = Math.sqrt(
                        Math.pow(r - corner.r, 2) + 
                        Math.pow(g - corner.g, 2) + 
                        Math.pow(b - corner.b, 2)
                    );
                    
                    if (diff < tolerance) {
                        isBackground = true;
                        break;
                    }
                }

                if (isBackground) {
                    data[i + 3] = 0; // Transparência Total
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setProcessedSrc(canvas.toDataURL("image/png"));
        };

        img.onerror = () => {
            console.error("Erro ao carregar imagem para transparência:", src);
            setProcessedSrc(src);
        };
    }, [src, tolerance]);

    // Fallback enquanto processa: renderiza a imagem original com opacidade reduzida
    // para evitar o "flash" do fundo sólido.
    if (!processedSrc) {
        return <img src={src} {...props} style={{ ...props.style, opacity: 0 }} />;
    }

    return <img src={processedSrc} {...props} />;
};
