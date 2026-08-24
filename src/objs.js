class Node2DObj {
    static isObj = true
    constructor(name) {
        this.name = name
    }

    _makeObject() {
        const elm = document.createElement("p")
        elm.innerText = "?"
        return elm
    }
    #_mobj = null
    get mainobj() {
        if (!this.#_mobj) {
            this.#_mobj = this._makeObject()
        }
        return this.#_mobj
    }

    get spec() {
        return [
            { labl: "Node2D", bubble: true },
            { labl: "Position", conts: [
                { labl: "X", type: "num" },
                { labl: "Y", type: "num" },
            ]},
            { labl: "Rotation", conts: [
                { labl: "Rot", type: "num" },
            ]},
            { labl: "Scale", conts: [
                { labl: "X", type: "num" },
                { labl: "Y", type: "num" },
            ]},
        ]
    }
    static cls = "misc"
    #_scrobj = null
    get sceneDef() {
        if (!this.#_scrobj) {
            this.#_scrobj = { labl: this.name, class: this.constructor.cls, spec: this.spec }
        }
        return this.#_scrobj
    }
}

// -----


class TextObj extends Node2DObj {
    constructor(name, txt="", size=18) {
        super(name)
        this.txt = txt
        this.sze = size
    }
    _makeObject() {
        const elm = document.createElement("p")
        elm.innerText = this.txt
        elm.style.fontSize = this.sze
        return elm
    }
    get fonts() {
        return [
            "font1",
            "font2",
        ]
    }
    get spec() {
        return [
            { labl: "Text", bubble: true },
            { labl: "Text", type: "multiline",
                value: this.txt, conn: (t)=>{ this.mainobj.innerText = t } },
            { labl: "Style", conts: [
                { labl: "Font size", type: "num" },
                { labl: "Font", type: "opts", choices: this.fonts },
                { labl: "Text colour", type: "col" },
            ]},
            { labl: "Width", type: "num" },
        null, ...super.spec]
    }
    static cls = "text"
}

class BannerObj extends TextObj {
    get choices() {
        return [
            "image1.png",
            "image2.png",
        ]
    }
    get spec() {
        return [
            { labl: "Banner", bubble: true },
            { labl: "Background colour", type: "col" },
            { labl: "Border style", type: "opts", choices: this.choices },
        null, ...super.spec]
    }
    static cls = "banner"
}

class SectionObj extends TextObj {
    get spec() {
        return [
            { labl: "Section", bubble: true },
            { labl: "Background style", type: "opts", choices: [
                "Regular",
                "Cool",
            ]},
        null, ...super.spec]
    }
    static cls = "sect"
}

// -----


class ImageObj extends Node2DObj {
    get spec() {
        return [
            { labl: "Image", bubble: true },
            { labl: "URL", type: "line" },
        null, ...super.spec]
    }
    static cls = "img"
}

class BackgroundObj extends Node2DObj {
    get choices() {
        return [
            "image1.png",
            "image2.png",
        ]
    }
    get spec() {
        return [
            { labl: "Background", bubble: true },
            { labl: "Image", type: "opts", choices: this.choices },
        null, ...super.spec]
    }
    static cls = "bg"
}

// -----


class FAQObj extends Node2DObj {
    get spec() {
        return [
            { labl: "FAQ Item", bubble: true },
            { labl: "Width", type: "num" },
            { labl: "Question", conts: [
                { labl: "Question", type: "multiline" },
                { labl: "Question colour", type: "col" },
            ]},
            { labl: "Answer", conts: [
                { labl: "Answer", type: "multiline" },
                { labl: "Answer colour", type: "col" },
            ]},
        null, ...super.spec]
    }
    static cls = "info"
}

// -----


class Page extends Node2DObj {
    static isObj = false
    constructor(name, conts, open=false) {
        super(name)
        this.conts = conts
        this.open = open
    }

    _makeObject() {
        const elm = document.createElement("div")
        return elm
    }

    static cls = "dot"
    #_scrobj = null
    get sceneDef() {
        if (!this.#_scrobj) {
            this.#_scrobj = { labl: this.name, class: this.constructor.cls,
                conts: this.conts, spec: this.spec }
        }
        return this.#_scrobj
    }
}
