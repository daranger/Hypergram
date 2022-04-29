const img = new Image();
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const brightness = document.getElementById('brightness');
const contrast = document.getElementById('contrast');
const transparent = document.getElementById('transparent');
const save = document.getElementById('save-button');

document.getElementById('file-input').onchange = function () {
    img.onload = draw;
    img.src = URL.createObjectURL(this.files[0]);
};

function draw() {
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.drawImage(this, 0, 0);
}

function Truncate(n) {
    if (n > 255)
        return 255;
    if (n <= 0)
        return 0;
    return n;
}

function bct(Brightness, Contrast, Transparent) {

    ctx.drawImage(img, 0, 0);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    for (let i = 0; i < pixels.length; i += 4) {

        let Factor = 259 * (255 + Contrast) / (255 * (259 - Contrast));

        pixels[i] = Truncate((Factor * (pixels[i] - 128) + 128) + Brightness);
        pixels[i + 1] = Truncate((Factor * (pixels[i + 1] - 128) + 128) + Brightness);
        pixels[i + 2] = Truncate((Factor * (pixels[i + 2] - 128) + 128) + Brightness);
        pixels[i + 3] = Truncate(pixels[i + 3] * Transparent);

    }
    ctx.putImageData(imageData, 0, 0);
}

function downloadCanvas() {

    let image = canvas.toDataURL();
    let tmpLink = document.createElement('a');
    tmpLink.download = 'result.png';
    tmpLink.href = image;
    document.body.appendChild(tmpLink);
    tmpLink.click();
    document.body.removeChild(tmpLink);
}

brightness.addEventListener("change", function () {
    bct(parseInt(brightness.value), parseInt(contrast.value), parseFloat(transparent.value));
});

contrast.addEventListener("change", function () {
    bct(parseInt(brightness.value), parseInt(contrast.value), parseFloat(transparent.value));
});


transparent.addEventListener("change", function () {
    bct(parseInt(brightness.value), parseInt(contrast.value), parseFloat(transparent.value));
});

save.addEventListener("click", downloadCanvas);