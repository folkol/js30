const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    const userMedia = navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(userMedia);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play()
        })
        .catch(console.error);
}

function paintToCanvas() {
    const {videoWidth: width, videoHeight: height} = video;

    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height)

        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = redEffect(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.1;
        pixels = greenScreen(pixels);

        ctx.putImageData(pixels, 0, 0);
        // console.log(pixels);
    }, 1000 / 60)
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] += 200;// = pixels.data[i + 0] + 100;
        pixels.data[i + 1];
        pixels.data[i + 2];
        pixels.data[i + 3];
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 550] = pixels.data[i + 0];// = pixels.data[i + 0] + 100;
        pixels.data[i + 500] = pixels.data[i + 1];// = pixels.data[i + 0] + 100;
        pixels.data[i - 550] = pixels.data[i + 2];// = pixels.data[i + 0] + 100;
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
    document.querySelectorAll('.rgb  input').forEach(input => {
        levels[input.name] = input.value
    });

    for (let i = 0; i < pixels.data.length; i += 4) {
        const red = pixels.data[i + 0];
        const green = pixels.data[i + 1];
        const blue = pixels.data[i + 2];
        const alpha = pixels.data[i + 3];

        // if (red >= levels.rmin
        //     && green >= levels.rmin
        //     && blue >= levels.bmin
        //     && red <= levels.rmax
        //     && green <= levels.gmax
        //     && blue <= levels.bmax) {
        //     pixels.data[i + 3] = 0;
        // }

        if(green / red < levels.gmax / levels.rmax) {
            pixels.data[i + 3] = 255;
        } else {
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');

    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
    strip.insertBefore(link, strip.firstChild);
}

getVideo();

video.addEventListener('canplay', paintToCanvas);