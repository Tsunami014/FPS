function connectValue(attrs, name, aftfn) {
    return { value: attrs[name], conn: (v)=>{ attrs[name] = v; aftfn() } }
}

class Node2DObj {
    static isObj = true
    constructor(name, attrs) {
        this.name = name
        this.attrs = { ...this._defaults, ...attrs }
    }
    get _defaults() { return {} }

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
    get _defaults() { return { ...super._defaults,
        text: "Placeholder",
        text_size: 18,
        text_font: "Monospace",
        text_colour: "#222222",
        max_width: 0,
    }}
    _makeObject() {
        const elm = document.createElement("p")
        this.#style(elm)
        return elm
    }
    #style(elm) {
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.innerText = attrs.text
        elm.style.fontSize = `${attrs.text_size}px`
        elm.style.fontFamily = attrs.text_font
        elm.style.color = attrs.text_colour
        elm.style.maxWidth = attrs.max_width==0? "" : `${attrs.max_width}px`
    }
    get fonts() {
        return [
            "Arial",
            "Times New Roman",
            "Georgia",
            "Monospace",
        ]
    }
    get spec() {
        const connval = (nam)=>connectValue(this.attrs, nam, ()=>this.#style())
        return [
            { labl: "Text", bubble: true },
            { labl: "Text", type: "multiline", ...connval("text") }
            { labl: "Style", conts: [
                { labl: "Font size", type: "num", ...connval("text_size"), bound: [8, 100] },
                { labl: "Font", type: "opts", choices: this.fonts, ...connval("text_font") }
                { labl: "Text colour", type: "col", ...connval("text_colour") }
            ]},
            { labl: "Width", type: "num", ...connval("max_width"), bound: [0, null] },
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
    get _defaults() { return { ...super._defaults,
        url: "https://www.placekittens.com/300/200",
        alt: "An image you forgot to add alt text for",
    }}
    _makeObject() {
        const elm = document.createElement("img")
        this.#style(elm)
        return elm
    }
    #style(elm) {
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.src = attrs.url
        elm.alt = attrs.alt
    }
    get spec() {
        const connval = (nam)=>connectValue(this.attrs, nam, ()=>this.#style())
        return [
            { labl: "Image", bubble: true },
            { labl: "URL", type: "line", ...connval("url") },
            { labl: "Alt text", type: "line", ...connval("alt") },
        null, ...super.spec]
    }
    static cls = "img"
}

class BackgroundObj extends Node2DObj {
    get _defaults() {
        const cs = Object.keys(this.choices)
        return { ...super._defaults,
        img: cs[Math.floor(Math.random() * cs.length)],
        width: 300,
        height: 300,
    }}
    _makeObject() {
        const elm = document.createElement("img")
        this.#style(elm)
        return elm
    }
    get choices() {
        return {
            "Thin kitten": ["https://www.placekittens.com/400/100", "A thin kitty"],
            "Tall kitten": ["https://www.placekittens.com/100/400", "A tall kitty"],
        }
    }
    #style(elm) {
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.src = this.choices[attrs.img][0]
        elm.alt = this.choices[attrs.img][1]
        elm.width = attrs.width
        elm.height = attrs.height
    }
    get spec() {
        const connval = (nam)=>connectValue(this.attrs, nam, ()=>this.#style())
        return [
            { labl: "Background", bubble: true },
            { labl: "Image", type: "opts", choices: Object.keys(this.choices), ...connval("img") },
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
