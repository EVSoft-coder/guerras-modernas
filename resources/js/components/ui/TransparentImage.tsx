import React, { useState, useEffect } from 'react';

// Cache global para evitar re-processar a mesma imagem múltiplas vezes na sessão
const PROCESSED_CACHE = new Map<string, string>();
// Controle de promessas em voo para evitar processamento duplicado simultâneo
const IN_FLIGHT_PROMISES = new Map<string, Promise<string>>();

interface TransparentImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    tolerance?: number;
    targetColor?: { r: number, g: number, b: number } | null;
}

/**
 * TransparentImage V6 — "Quantum Efficiency".
 * Utiliza ObjectURLs (Blobs) em vez de Base64 para performance extrema e baixo consumo de memória.
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, tolerance = 30, targetColor, ...props }) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(src ? PROCESSED_CACHE.get(src) || null : null);

    useEffect(() => {
        if (!src) return;
        
        // Se já está no cache, atualizar estado
        if (PROCESSED_CACHE.has(src)) {
            setProcessedSrc(PROCESSED_CACHE.get(src)!);
            return;
        }

        const processImage = async () => {
            if (IN_FLIGHT_PROMISES.has(src)) {
                try {
                    const result = await IN_FLIGHT_PROMISES.get(src);
                    setProcessedSrc(result || null);
                } catch (e) {
                    setProcessedSrc(src);
                }
                return;
            }

            const processingPromise = new Promise<string>((resolve) => {
                const img = new Image();
                img.crossOrigin = "Anonymous";
                
                fetch(src)
                    .then(res => res.blob())
                    .then(blob => {
                        const objectUrl = URL.createObjectURL(blob);
                        img.src = objectUrl;
                        
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d', { willReadFrequently: true });
                            if (!ctx) {
                                URL.revokeObjectURL(objectUrl);
                                resolve(src);
                                return;
                            }

                            canvas.width = img.width;
                            canvas.height = img.height;
                            ctx.drawImage(img, 0, 0);

                            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                            const data = imageData.data;

                            const bgR = targetColor ? targetColor.r : data[0];
                            const bgG = targetColor ? targetColor.g : data[1];
                            const bgB = targetColor ? targetColor.b : data[2];

                            for (let i = 0; i < data.length; i += 4) {
                                const dist = Math.abs(data[i] - bgR) + Math.abs(data[i+1] - bgG) + Math.abs(data[i+2] - bgB);
                                if (dist < tolerance * 1.5) data[i + 3] = 0;
                            }

                            ctx.putImageData(imageData, 0, 0);
                            
                            // MUDANÇA CRÍTICA: toBlob em vez de toDataURL (Base64)
                            canvas.toBlob((finalBlob) => {
                                if (finalBlob) {
                                    const finalUrl = URL.createObjectURL(finalBlob);
                                    URL.revokeObjectURL(objectUrl);
                                    resolve(finalUrl);
                                } else {
                                    URL.revokeObjectURL(objectUrl);
                                    resolve(src);
                                }
                            }, "image/png");
                        };

                        img.onerror = () => {
                            URL.revokeObjectURL(objectUrl);
                            resolve(src);
                        };
                    })
                    .catch(() => resolve(src));
            });

            IN_FLIGHT_PROMISES.set(src, processingPromise);

            try {
                const result = await processingPromise;
                PROCESSED_CACHE.set(src, result);
                setProcessedSrc(result);
            } catch (e) {
                setProcessedSrc(src);
            } finally {
                IN_FLIGHT_PROMISES.delete(src);
            }
        };

        processImage();
    }, [src, tolerance, targetColor?.r, targetColor?.g, targetColor?.b]);

    const displaySrc = processedSrc || src;

    return (
        <img 
            src={displaySrc} 
            {...props} 
            loading="lazy" // Sugestão para o browser priorizar LCP
            style={{ 
                ...props.style,
                opacity: processedSrc ? 1 : 0.2,
                transition: 'opacity 0.15s ease-in-out',
                contentVisibility: 'auto' // Otimização moderna de renderização
            }} 
        />
    );
};
