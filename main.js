import { uploadFile, generateQRCode, getFileURL } from "./utils.js";

/** @type {HTMLDivElement} */
const dropArea = document.querySelector(".drop-area");
/** @type {HTMLInputElement} */
const fileInput = document.querySelector(".file-inp");
/** @type {HTMLDivElement} */
const qrContainer = document.querySelector(".qr-result");


checkFile();

dropArea.onclick = () => fileInput.click();

dropArea.ondrop = (ev) => {
    ev.preventDefault();
    dropArea.classList.remove("drag-over");

    let file;

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        const [item] = ev.dataTransfer.items;
        if (item.kind === "file") file = item.getAsFile();
    } else {
        // Use DataTransfer interface to access the file(s)
        file = ev.dataTransfer.files[0];
    }

    if (file) startFileUpload(file);
};

dropArea.ondragover = (ev) => {
    ev.preventDefault();
    dropArea.classList.add("drag-over");
};

dropArea.ondragleave = dropArea.ondragend = (ev) => {
    ev.preventDefault();
    dropArea.classList.remove("drag-over");
};

fileInput.onchange = async () => {
    const [file] = fileInput.files;

    await startFileUpload(file);
}

/** @param {File} file  */
async function startFileUpload(file) {
    let code;

    dropArea.classList.add("loading");

    try {
        code = await uploadFile(file);
    } catch (err) {
        console.error(err);
        alert("Oops, an error occured!");
        return;
    } finally {
        dropArea.classList.remove("loading");
    }

    const url = new URL(location.origin);
    url.searchParams.set("file", code);

    qrContainer.innerHTML = "";
    generateQRCode(url.href, qrContainer);
}

async function checkFile() {
    const params = new URLSearchParams(location.search);

    if (!params.has("file")) return;

    document.innerHTML = "Please wait...";

    const file = params.get("file");
    const fileUrl = getFileURL(file);

    const res = await fetch(fileUrl);
    const blob = await res.blob();
    const blobURL = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.textContent = "Download image";
    link.download = file;
    link.href = blobURL;

    document.body.innerHTML = link.outerHTML;

    link.click();
}