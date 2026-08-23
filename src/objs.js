class Node2DObj {
    constructor(name) {
        this.name = name
    }

    get spec() {
        return [
            { labl: "Node2D", bubble: true },
            { labl: "Position", conts: [
                { labl: "X", type: "labl" },
                { labl: "Y", type: "labl" },
            ]},
            { labl: "Rotation", conts: [
            ]},
            { labl: "Scale", conts: [
                { labl: "X", type: "labl" },
                { labl: "Y", type: "labl" },
            ]},
        ]
    }

    static get cls() { return "misc" }

    get screenObj() {
        return { labl: this.name, class: this.constructor.cls, spec: this.spec }
    }
}

// -----


class TextObj extends Node2DObj {
    get spec() {
        return [
            { labl: "Text", bubble: true },
            { labl: "Text", type: "multiline" },
            { labl: "Text colour", type: "labl" },
            { labl: "Width", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "text" }
}

class BannerObj extends TextObj {
    get spec() {
        return [
            { labl: "Banner", bubble: true },
            { labl: "Background colour", type: "labl" },
            { labl: "Border style", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "banner" }
}

class SectionObj extends TextObj {
    get spec() {
        return [
            { labl: "Section", bubble: true },
            { labl: "Background style", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "sect" }
}

// -----


class ImageObj extends Node2DObj {
    get spec() {
        return [
            { labl: "Image", bubble: true },
            { labl: "URL", type: "line" },
        null, ...super.spec]
    }
    static get cls() { return "img" }
}

class BackgroundObj extends Node2DObj {
    get spec() {
        return [
            { labl: "Background", bubble: true },
            { labl: "Image", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "bg" }
}

// -----


class FAQObj extends TextObj {
    get spec() {
        return [
            { labl: "FAQ Item", bubble: true },
            { labl: "Question", type: "labl" },
            { labl: "Answer", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "info" }
}
