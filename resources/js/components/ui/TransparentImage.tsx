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
 * TransparentImage V5 — "Atomic Performance & Concurrency".
 * Sistema de cache inteligente com bloqueio de concorrência para evitar gargalos de CPU.
 */
export const TransparentImage: React.FC<TransparentImageProps> = ({ src, tolerance = 30, targetColor, ...props }) => {
    const [processedSrc, setProcessedSrc] = useState<string | null>(src ? PROCESSED_CACHE.get(src) || null : null);

    useEffect(() => {
        if (!src) return;
        
        // Se já está no cache, atualizar estado (caso tenha sido preenchido por outro componente)
        if (PROCESSED_CACHE.has(src)) {
            setProcessedSrc(PROCESSED_CACHE.get(src)!);
            return;
        }

        const processImage = async () => {
            // Se já existe uma promessa para esta imagem, aguardar por ela
            if (IN_FLIGHT_PROMISES.has(src)) {
                try {
                    const result = await IN_FLIGHT_PROMISES.get(src);
                    setProcessedSrc(result || null);
                } catch (e) {
                    setProcessedSrc(src);
                }
                return;
            }

            // Criar nova promessa de processamento
            const processingPromise = new Promise<string>((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // Prevenção de Tainted Canvas
                
                // Carregar via Blob para garantir cache do browser e evitar problemas de CORS
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
                                // Distância de Manhattan (Performance Máxima)
                                const dist = Math.abs(data[i] - bgR) + Math.abs(data[i+1] - bgG) + Math.abs(data[i+2] - bgB);
                                if (dist < tolerance * 1.5) data[i + 3] = 0;
                            }

                            ctx.putImageData(imageData, 0, 0);
                            const finalDataUrl = canvas.toDataURL("image/png");
                            
                            URL.revokeObjectURL(objectUrl);
                            resolve(finalDataUrl);
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
                // Manter no cache global, mas remover da lista de promessas ativas
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
            style={{ 
                ...props.style,
                opacity: processedSrc ? 1 : 0.3,
                transition: 'opacity 0.2s ease-in-out'
            }} 
        />
    );
};
