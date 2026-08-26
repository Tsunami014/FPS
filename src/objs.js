function connectValue(obj, name) {
    return {
        value: obj.attrs[name],
        conn(v) {
            obj.attrs[name] = v
            obj._style()
            updFocus()
        },
    }
}

class BaseObj {
    static isObj = true
    constructor(name, attrs) {
        this.name = name
        this.attrs = { ...this._defaults, ...attrs }
    }
    static get _catrs() { return {} }
    get _defaults() { return {
        default: false
    }}

    _style(elm) {
        if (this.attrs.default) {
            (elm? elm : this.mainobj).id = "default"
        }
    }
    _makeObject() {
        const elm = document.createElement("p")
        elm.innerText = "?"
        this._style(elm)
        return elm
    }
    #_mobj = null
    get mainobj() {
        if (!this.#_mobj) {
            this.#_mobj = this._makeObject()
        }
        return this.#_mobj
    }

    get spec() { return [] }
    static cls = "misc"
    get sceneDef() {
        return { labl: this.name, class: this.constructor.cls, spec: this.spec }
    }
}
class Node2DObj extends BaseObj {
    get _defaults() { return { ...super._defaults,
        x: 0,
        y: 0,
        rot: 0,
    }}

    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.style.translate = `${attrs.x}px ${attrs.y}px`
        elm.style.rotate = `${attrs.rot}deg`
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Node2D", bubble: true },
            { labl: "Position", conts: [
                { labl: "X", type: "num", ...connval("x"), step: 3 },
                { labl: "Y", type: "num", ...connval("y"), step: 3 },
            ]},
            { labl: "Rotation", conts: [
                { labl: "Rot", type: "num", ...connval("rot"), step: 2 },
            ]},
        ]
    }
    static cls = "misc"
    get sceneDef() {
        return { labl: this.name, class: this.constructor.cls, spec: this.spec }
    }
}

// -----


class TextObj extends Node2DObj {
    get _defaults() { return { ...super._defaults,
        text: "Placeholder",
        text_size: 18,
        text_font: "Monospace",
        text_style: [],
        text_colour: "#222222",
        max_width: 0,
    }}
    _makeObject() {
        const elm = document.createElement("p")
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        const cats = this.constructor._catrs
        if (!elm) elm = this.mainobj
        elm.innerText = attrs.text
        elm.style.fontSize = `${attrs.text_size}px`
        elm.style.fontFamily = attrs.text_font
        elm.style.color = attrs.text_colour
        elm.style.fontWeight = attrs.text_style.includes("Bold")? "bold":""
        elm.style.fontStyle = attrs.text_style.includes("Italics")? "italic":""
        elm.style.fontVariant = attrs.text_style.includes("Small Caps")? "small-caps":""
        elm.style.textDecoration = attrs.text_style.includes("Underline")? "underline":""
        if (cats?.text_width !== false) elm.style.maxWidth = attrs.max_width==0? "" : attrs.max_width +'px'
    }
    get fonts() {
        return [
            "Arial",
            "Times New Roman",
            "Georgia",
            "Monospace",
        ]
    }
    get styles() {
        return [
            "Bold",
            "Italics",
            "Underline",
            "Small Caps",
        ]
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        const cats = this.constructor._catrs
        return [
            { labl: "Text", bubble: true },
            { labl: "Text", type: "multiline", ...connval("text") },
            { labl: "Style", conts: [
                { labl: "Font size", type: "num", ...connval("text_size"),
                    bound: [8, 100] },
                { labl: "Font", type: "opts", ...connval("text_font"),
                    choices: this.fonts },
                { labl: "Text colour", type: "col", ...connval("text_colour") },
                { labl: "Style", type: "multiopts", ...connval("text_style"),
                    choices: this.styles },
            ]},
            { labl: "Width", type: "num", ...connval("max_width"),
                bound: [0, null], step: 5, show: cats?.text_width },
        null, ...super.spec]
    }
    static cls = "text"
}

class BannerObj extends TextObj {
    get choices() {
        return [
            "style1",
            "style2",
        ]
    }
    static get _catrs() { return { ...super._catrs,
        text_width: false,
    }}
    get _defaults() { return { ...super._defaults,
        width: 500,
        height: 0,
        background_style: this.choices[0],
        background_col: "#CCCCCC",
    }}
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        // TODO: Background style
        elm.style.backgroundColor = attrs.background_col
        elm.style.maxWidth = "unset"
        elm.style.width = attrs.width
        elm.style.height = attrs.height==0? "fit-content" : attrs.height
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Banner", bubble: true },
            { labl: "Width", type: "num", ...connval("width"),
                bound: [1, null], step: 5 },
            { labl: "Height", type: "num", ...connval("height"),
                bound: [0, null], step: 5 },
            { labl: "Style", conts: [
                { labl: "Background colour", type: "col", ...connval("background_col") },
                { labl: "Border style", type: "opts", ...connval("background_style"),
                    choices: this.choices },
            ]}
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
        url: "/imgs/square.webp",
        alt: "An image you forgot to add alt text for",
    }}
    _makeObject() {
        const elm = document.createElement("img")
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.src = attrs.url
        elm.alt = attrs.alt
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
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
        this._style(elm)
        return elm
    }
    get choices() {
        return {
            "Thin kitten": ["/imgs/flat.webp", "A thin kitty"],
            "Tall kitten": ["/imgs/tall.webp", "A tall kitty"],
        }
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.src = this.choices[attrs.img][0]
        elm.alt = this.choices[attrs.img][1]
        elm.width = attrs.width
        elm.height = attrs.height
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Background", bubble: true },
            { labl: "Image", type: "opts", ...connval("img"),
                choices: Object.keys(this.choices) },
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


class BasePage extends BaseObj {
    static isObj = false
    constructor(name, conts, attrs) {
        super(name, attrs)
        this.conts = conts
        this.open = attrs?.open
    }

    _makeObject() { return document.createElement("div") }
    static cls = "dot"
    get sceneDef() {
        return { labl: this.name, class: this.constructor.cls,
            conts: this.conts, spec: this.spec }
    }
}
class Page extends Node2DObj {
    static isObj = false
    constructor(name, conts, attrs) {
        super(name, attrs)
        this.conts = conts
        this.open = attrs?.open
    }
    get _defaults() { return { ...super._defaults,
        scale: 1,
    }}

    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        if (!elm) elm = this.mainobj
        elm.style.scale = attrs.scale
    }
    _makeObject() {
        const elm = document.createElement("div")
        this._style(elm)
        return elm
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [...super.spec,
            { labl: "Scale", conts: [
                { labl: "Scale", type: "num", ...connval("scale"),
                    step: 0.03 },
            ]},
        ]
    }
    static cls = "dot"
    get sceneDef() {
        return { labl: this.name, class: this.constructor.cls,
            conts: this.conts, spec: this.spec }
    }
}
