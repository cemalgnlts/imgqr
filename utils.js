import QrCreator from "./lib/QRCreator.js";

const FILE_API = "https://litterbox.catbox.moe/resources/internals/api.php";
const FILE_BASE_URL = "https://litter.catbox.moe";

/**
 * @param {string} text 
 * @param {HTMLDivElement} container
 */
export function generateQRCode(text, container) {
    QrCreator.render({
        text,
        radius: 0.2,
        ecLevel: "M",
        fill: "#4c4f69",
        background: null,
        size: 256
    }, container);
}

/**
 * @param {File} file 
 * @returns {Promise<String>}
 */
export async function uploadFile(file) {
    const formData = new FormData();
    formData.set("reqtype", "fileupload");
    formData.set("fileNameLength", "6");
    formData.set("fileToUpload", file);
    formData.set("time", "1h");

    const res = await fetch(FILE_API, {
        method: "POST",
        body: formData
    });

    if (!res.ok) throw Error(res.status + ": " + res.statusText);

    const url = await res.text();
    const code = url.split("/").pop();

    return code;
}

/**
 * 
 * @param {string} file File code.
 * @return {string} Full file url.
 */
export function getFileURL(file) {
    return new URL(file, FILE_BASE_URL);
}