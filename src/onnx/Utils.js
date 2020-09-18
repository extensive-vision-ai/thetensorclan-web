import ndarray from "ndarray";
import ops from "ndarray-ops";
import { Tensor } from "onnxjs";
import colormap from "colormap";

export async function warmupModel(model, dims) {
    // OK. we generate a random input and call Session.run() as a warmup query
    const size = dims.reduce((a, b) => a * b);
    const warmupTensor = new Tensor(new Float32Array(size), "float32", dims);

    for (let i = 0; i < size; i++) {
        warmupTensor.data[i] = Math.random() * 2.0 - 1.0; // random value [-1.0, 1.0)
    }
    try {
        console.log("warming up da model");
        const warmOut = await model.run([warmupTensor]);
        // console.log(warmOut);
    } catch (e) {
        console.error(e);
    }
}

export function imageDataRgbaToNdarray(imageData) {
    const { data, width, height } = imageData;

    const dataArray = ndarray(new Float32Array(data), [width, height, 4]);

    return dataArray;
}

export function NdarrayAlphaToMono(imageArray) {
    var result = ndarray(
        new Float32Array(imageArray.shape[0] * imageArray.shape[1]),
        [imageArray.shape[0], imageArray.shape[1]]
    );

    ops.assign(result, imageArray.pick(null, null, 3));
    // ops.mulseq(result, -1.0);
    // ops.addseq(result, 1.0);

    return result;
}

export function NdarrayRgbaToMono(imageArray) {
    var result = ndarray(
        new Float32Array(imageArray.shape[0] * imageArray.shape[1]),
        [imageArray.shape[0], imageArray.shape[1]]
    );

    ops.add(
        result,
        imageArray.pick(null, null, 0),
        imageArray.pick(null, null, 1),
        imageArray.pick(null, null, 2)
    );

    ops.divseq(result, 3.0);

    return result;
}

export function ndArrayToTensor(imageArray, N, C, H, W) {
    const tensor = new Tensor(new Float32Array(N * C * H * W), "float32", [
        N,
        C,
        W,
        H,
    ]);

    tensor.data.set(imageArray.data);

    return tensor;
}

export function getTensorFromCanvasContext(ctx) {
    // get the image data from canvas
    const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );
    // data is a array RGBA [R[0], G[0], B[0], A[0], R[1], G[1], B[1], A[1] . . .]
    // basically pixel 0 RGBA is first 4 elements in the array
    const { data, width, height } = imageData;
    // an array with shape H * W * C
    const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
    // an array with shape N * C * H * W
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
        1,
        3,
        width,
        height,
    ]);
    ops.assign(
        dataProcessedTensor.pick(0, 0, null, null),
        dataTensor.pick(null, null, 2)
    );
    ops.assign(
        dataProcessedTensor.pick(0, 1, null, null),
        dataTensor.pick(null, null, 1)
    );
    ops.assign(
        dataProcessedTensor.pick(0, 2, null, null),
        dataTensor.pick(null, null, 0)
    );
    ops.divseq(dataProcessedTensor, 255);
    // perform normalization with mean and std
    // ops.subseq(dataProcessedTensor.pick(0, 0, null, null), 0.485);
    // ops.subseq(dataProcessedTensor.pick(0, 1, null, null), 0.456);
    // ops.subseq(dataProcessedTensor.pick(0, 2, null, null), 0.406);
    // ops.divseq(dataProcessedTensor.pick(0, 0, null, null), 0.229);
    // ops.divseq(dataProcessedTensor.pick(0, 1, null, null), 0.224);
    // ops.divseq(dataProcessedTensor.pick(0, 2, null, null), 0.225);
    const tensor = new Tensor(new Float32Array(3 * width * height), "float32", [
        1,
        3,
        width,
        height,
    ]);
    tensor.data.set(dataProcessedTensor.data);
    return tensor;
}

export function setCanvasFromMonoTensor(tensor, canvas) {
    // console.log(tensor);
    // return;
    const height = tensor.dims[2];
    const width = tensor.dims[3];
    var t_data = tensor.data;

    let t_index = 0;

    const ctx = canvas.getContext("2d");

    var contextImageData = ctx.createImageData(width, height);
    var contextData = contextImageData.data;
    // console.log(contextImageData);

    // let colors = colormap({
    //     colormap: "bone",
    //     nshades: 255,
    //     format: "rba",
    //     alpha: 1,
    // });

    let index = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            const d = t_data[t_index++];
            // const colorIndex = Math.round(d * 255.0);

            // const colorMapValue = colors[colorIndex];

            // const r = colorMapValue[0];
            // const g = colorMapValue[1];
            // const b = colorMapValue[2];
            // const a = colorMapValue[3];

            // contextData[index++] = r;
            // contextData[index++] = g;
            // contextData[index++] = b;
            // contextData[index++] = a;

            contextData[index++] = 0;
            contextData[index++] = 0;
            contextData[index++] = 0;
            contextData[index++] = Math.round(d * 255.0);
        }
    }

    ctx.putImageData(contextImageData, 0, 0);
    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
}

export function setContextFromTensor(tensor, ctx) {
    const height = tensor.dims[2];
    const width = tensor.dims[3];
    var t_data = tensor.data;

    let red = 0;
    let green = red + height * width;
    let blue = green + height * width;

    var contextImageData = ctx.getImageData(0, 0, width, height);
    var contextData = contextImageData.data;

    let index = 0;
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            const r = t_data[red++];
            const g = t_data[green++];
            const b = t_data[blue++];

            contextData[index++] = r;
            contextData[index++] = g;
            contextData[index++] = b;
            contextData[index++] = 0xff;
        }
    }

    ctx.putImageData(contextImageData, 0, 0);
}

export function canvasToTensor(canvasId) {
    var ctx = document.getElementById(canvasId).getContext("2d");

    const n = 1;
    const c = 3;
    const h = ctx.canvas.height;
    const w = ctx.canvas.width;

    // float array of our data in form of NCHW
    const out_data = new Float32Array(n * c * h * w);

    // load src context to a tensor
    var srcImgData = ctx.getImageData(0, 0, w, h);
    var src_data = srcImgData.data;

    var src_idx = 0;
    // [R[0], G[0], B[0], A[0], R[1], G[1] . . .] is how they pixels are arranged
    var out_idx_r = 0;
    var out_idx_g = out_idx_r + h * w;
    var out_idx_b = out_idx_g + h * w;

    // dont perform normalization here, do it if you want to later
    const norm = 1.0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            let src_r = src_data[src_idx++];
            let src_g = src_data[src_idx++];
            let src_b = src_data[src_idx++];
            // skip the alpha part
            src_idx++;

            out_data[out_idx_r++] = src_r / norm;
            out_data[out_idx_g++] = src_g / norm;
            out_data[out_idx_b++] = src_b / norm;
        }
    }

    const out = new Tensor(out_data, "float32", [n, c, h, w]);

    return out;
}

export function tensorToCanvas(tensor, canvasId) {
    const h = tensor.dims[2];
    const w = tensor.dims[3];
    var t_data = tensor.data;

    let t_idx_r = 0;
    let t_idx_g = t_idx_r + h * w;
    let t_idx_b = t_idx_g + h * w;

    var dst_ctx = document.getElementById(canvasId).getContext("2d");
    var dst_ctx_imgData = dst_ctx.getImageData(0, 0, w, h);
    var dst_ctx_data = dst_ctx_imgData.data;

    let dst_idx = 0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            let r = t_data[t_idx_r++];
            let g = t_data[t_idx_g++];
            let b = t_data[t_idx_b++];

            dst_ctx_data[dst_idx++] = r;
            dst_ctx_data[dst_idx++] = g;
            dst_ctx_data[dst_idx++] = b;
            dst_ctx_data[dst_idx++] = 0xff;
        }
    }

    dst_ctx.putImageData(dst_ctx_imgData, 0, 0);
}

export function resampleCanvasImage(canvas, width, height) {
    var width_source = canvas.width;
    var height_source = canvas.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = (weight * data[pos_x + 3]) / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }

    return img2;
}
