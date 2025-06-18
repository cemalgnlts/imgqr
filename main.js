import { uploadFile, generateQRCode, getFileURL } from "./utils.js";

const dropArea = document.querySelector(".drop-area");
const fileInput = document.querySelector(".file-inp");
const qrContainer = document.querySelector(".qr-result");

dropArea.onclick = () => fileInput.click();

checkFile();

fileInput.onchange = async () => {
    const [file] = fileInput.files;
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