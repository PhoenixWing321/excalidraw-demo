import type { ExcalidrawElement, ExcalidrawImageElement } from "@excalidraw/excalidraw/types";
import type { ExcalidrawAPIRefValue } from "@excalidraw/excalidraw/types";

export interface MeasurementResult {
    rgb?: [number, number, number];
    grayscale?: number;
    average?: number;
    timestamp: number;
}

export class MeasureCore {
    private excalidrawAPI: ExcalidrawAPIRefValue | null;
    private imageElements: ExcalidrawImageElement[] = [];
    private elements: ExcalidrawElement[];

    constructor(excalidrawAPI: ExcalidrawAPIRefValue | null, elements: ExcalidrawElement[]) {
        this.excalidrawAPI = excalidrawAPI;
        this.elements = elements;
    }

    // 添加图片元素列表管理
    addImageElement(element: ExcalidrawImageElement) {
        if (!this.imageElements.find(e => e.id === element.id)) {
            this.imageElements.push(element);
        }
    }

    clearImageElements() {
        this.imageElements = [];
    }

    getImageElements() {
        return this.imageElements;
    }

    getImageCount() {
        return this.imageElements.length;
    }

    // 搜索图片元素
    searchImageElements() {
        this.clearImageElements();
        this.elements.forEach(element => {
            if (MeasureCore.isImageElement(element)) {
                this.addImageElement(element);
            }
        });
        console.log('找到图片元素:', this.imageElements.length);
        return this.imageElements;
    }
    async measure(): Promise<Map<string, MeasurementResult>> {
        if (!this.excalidrawAPI) {
            throw new Error('Excalidraw API not available');
        }

        const measurements = new Map<string, MeasurementResult>();
        const files = this.excalidrawAPI.getFiles();

        if (!files) {
            throw new Error('No files found');
        }

        // 获取所有图片文件
        const imageFiles = Object.entries(files)
            .filter(([_, file]) => file.mimeType.startsWith('image/'))
            .map(([id, file]) => ({
                id,
                ...file
            }));

        console.log('Found image files:', imageFiles);

        for (const imgFile of imageFiles) {
            try {
                if (!imgFile.dataURL) {
                    console.warn(`No data URL for image: ${imgFile.id}`);
                    continue;
                }

                const measurement = await this.measureImage(imgFile.dataURL);
                measurements.set(imgFile.id, {
                    ...measurement,
                    timestamp: Date.now()
                });

            } catch (error) {
                console.error(`Error measuring image ${imgFile.id}:`, error);
            }
        }

        return measurements;
    }

    private async measureImage(dataURL: string): Promise<Omit<MeasurementResult, 'timestamp'>> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(new Error('Failed to get canvas context'));
                    return;
                }

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                try {
                    const centerX = Math.floor(img.width / 2);
                    const centerY = Math.floor(img.height / 2);

                    // 获取中心点RGB值
                    const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
                    const rgb: [number, number, number] = [pixel[0], pixel[1], pixel[2]];

                    // 计算灰度值
                    const grayscale = Math.round((rgb[0] + rgb[1] + rgb[2]) / 3);

                    // 计算平均值
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const average = Math.round(
                        imageData.data.reduce((sum, val, i) =>
                            (i % 4 !== 3 ? sum + val : sum), 0
                        ) / (img.width * img.height * 3)
                    );

                    resolve({ rgb, grayscale, average });
                } catch (error) {
                    reject(error);
                } finally {
                    // 清理资源
                    canvas.width = 0;
                    canvas.height = 0;
                }
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = dataURL;
        });
    }

    // 其他辅助方法
    static isImageElement(element: ExcalidrawElement): element is ExcalidrawImageElement {
        return element.type === 'image' && !element.isDeleted;
    }

    // set elements
    setElements(elements: ExcalidrawElement[]) {
        this.elements = elements;
    }

    setExcalidrawAPI(excalidrawAPI: ExcalidrawAPIRefValue | null) {
        this.excalidrawAPI = excalidrawAPI;
    }

    setImageElements(imageElements: ExcalidrawImageElement[]) {
        this.imageElements = imageElements;
    }
} 