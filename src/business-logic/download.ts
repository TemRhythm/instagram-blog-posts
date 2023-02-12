import JSZip from "jszip";
import * as htmlToImage from "html-to-image";
import {saveAs} from "file-saver";

export async function downloadSlides(container: HTMLDivElement, zipFileName: string) {
    const zip = new JSZip();
    const promises: Promise<Blob | null>[] = [];
    const slideList = container.querySelectorAll<HTMLElement>('.slide');
    slideList.forEach(slide => {
        promises.push(htmlToImage.toBlob(slide));
    });
    const imagesFolder = zip.folder('images');
    const data = await Promise.all(promises);
    data.forEach((dataItem, index) => {
        if(dataItem) {
            imagesFolder?.file(`slide${index + 1}.png`, dataItem, {binary: true});
        }
    });
    const content = await zip.generateAsync({type: "blob"});
    saveAs(content, `${zipFileName}.zip`);
}
