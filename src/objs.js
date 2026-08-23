class Node2D {
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
            { labl: "Rotation", type: "labl" },
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


class TextObj extends Node2D {
    get spec() {
        return [
            { labl: "Text", bubble: true },
            { labl: "Text", type: "labl" },
            { labl: "Text Colour", type: "labl" },
            { labl: "Width", type: "labl" },
        null, ...super.spec]
    }
    static get cls() { return "info" }
}

class TestObj extends Node2D {
    get spec() {
        return [
            { labl: "Test", bubble: true },
            { labl: "Test", type: "btn" },
        null, ...super.spec]
    }
    static get cls() { return "object" }
}
