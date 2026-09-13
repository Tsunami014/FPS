function connectValue(obj, name) {
    return {
        value: obj.attrs[name],
        conn(v) {
            obj.attrs[name] = v
            obj._style(obj.mainobj)
            updFocus()
        },
    }
}

class BaseObj {
    static isObj = true
    static isInvis = false
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
            elm.id = "default"
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
class BlankObj extends BaseObj {
    static isInvis = true
    _style(elm) {
        // No super, we don't want this to be default ever
        elm.hidden = true
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
        elm.style.translate = `${attrs.x}px ${attrs.y}px`
        elm.style.rotate = `${attrs.rot}deg`
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Node2D", bubble: true },
            { labl: "Position", conts: [
                { labl: "X", type: "num", ...connval("x"), step: 2 },
                { labl: "Y", type: "num", ...connval("y"), step: 2 },
            ]},
            { labl: "Rotation", conts: [
                { labl: "Rot", type: "num", ...connval("rot"), step: 2 },
            ]},
        ]
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
        text_align_horiz: "Centre",
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
        elm.innerText = attrs.text
        elm.style.fontSize = `${attrs.text_size}px`
        elm.style.fontFamily = attrs.text_font
        elm.style.color = attrs.text_colour
        elm.style.fontWeight = attrs.text_style.includes("Bold")? "bold":""
        elm.style.fontStyle = attrs.text_style.includes("Italics")? "italic":""
        elm.style.fontVariant = attrs.text_style.includes("Small Caps")? "small-caps":""
        elm.style.textDecoration = attrs.text_style.includes("Underline")? "underline":""
        if (cats?.text_width !== false) elm.style.width = attrs.max_width==0? "" : attrs.max_width +'px'
        elm.style.textAlign = attrs.text_align_horiz=="Centre"? "center" : attrs.text_align_horiz.toLowerCase()
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
            { labl: "Horizontal alignment", type: "opts", ...connval("text_align_horiz"),
                choices: ["Left", "Centre", "Right"] },
        null, ...super.spec]
    }
    static cls = "text"
}

class LinkObj extends TextObj {
    get _defaults() { return { ...super._defaults,
        url: "https://this-page-intentionally-left-blank.org",
        text_colour: "#3366CC",
    }}
    _makeObject() {
        const elm = document.createElement("a")
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        elm.href = this.attrs.url
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Link", bubble: true },
            { labl: "URL", type: "line", ...connval("url") },
        null, ...super.spec]
    }
    static cls = "link"
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
        width: 0,
        height: 0,
        background_style: this.choices[0],
        background_col: "#CCCCCC",
        text_align_vert: "Centre"
    }}
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        // TODO: Background style
        elm.style.backgroundColor = attrs.background_col
        elm.style.width = attrs.width==0? "fit-content" : attrs.width
        if (attrs.width == 0) {
            elm.style.maxWidth = ""
        } else {
            elm.style.maxWidth = elm.style.width
        }
        elm.style.height = attrs.height==0? "fit-content" : attrs.height
        elm.style.alignContent = {
            Top: "baseline",
            Centre: "center",
            Bottom: "end",
        }[attrs.text_align_vert]
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Banner", bubble: true },
            { labl: "Width", type: "num", ...connval("width"),
                bound: [0, null], step: 5 },
            { labl: "Height", type: "num", ...connval("height"),
                bound: [0, null], step: 5 },
            { labl: "Style", conts: [
                { labl: "Background colour", type: "col", ...connval("background_col") },
                { labl: "Border style", type: "opts", ...connval("background_style"),
                    choices: this.choices },
            ]},
            { labl: "Vertical alignment", type: "opts", ...connval("text_align_vert"),
                choices: ["Top", "Centre", "Bottom"] },
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
        width: 0,
        height: 0,
    }}
    _makeObject() {
        const elm = document.createElement("img")
        function afterconn() {
            setTimeout(updFocus, 100)
        }
        if (elm.complete) {
            afterconn()
        }
        elm.addEventListener('load', afterconn)
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        elm.src = attrs.url
        elm.alt = attrs.alt
        elm.style.width = attrs.width==0? "fit-content" : attrs.width
        elm.style.maxWidth = elm.style.width
        elm.style.height = attrs.height==0? "fit-content" : attrs.height
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        const cats = this.constructor._catrs
        return [
            { labl: "Image", bubble: true },
            { labl: "URL", type: "line", ...connval("url"),
                show: cats?.img_url },
            { labl: "Alt text", type: "line", ...connval("alt"),
                show: cats?.img_alt },
            { labl: "Size", conts: [
                { labl: "Width", type: "num", ...connval("width"),
                    bound: [0, null], step: 5 },
                { labl: "Height", type: "num", ...connval("height"),
                    bound: [0, null], step: 5 },
            ]}
        null, ...super.spec]
    }
    static cls = "img"
}

class BackgroundObj extends ImageObj {
    get _defaults() {
        return { ...super._defaults,
        img: Object.keys(this.choices)[0],
    }}
    static get _catrs() { return { ...super._catrs,
        img_url: false,
        img_alt: false,
    }}
    get choices() {
        return {
            "Thin kitten": ["/imgs/flat.webp", "A thin kitty"],
            "Tall kitten": ["/imgs/tall.webp", "A tall kitty"],
        }
    }
    _style(elm) {
        const choice = this.choices[this.attrs.img]
        this.attrs.url = choice[0]
        this.attrs.alt = choice[1]
        super._style(elm)
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
    get _defaults() {
        return { ...super._defaults,
        width: 500,
        question: "What about xyz?",
        answer: "Of course!",
        qu_bg_colour: "#CCCCCC",
        ans_bg_colour: "#DDDDDD",
        qu_align: "Left",
        ans_align: "Centre",
    }}

    _makeObject() {
        const elm = document.createElement("details")
        elm.className = "faq"
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        var sum = elm.firstElementChild
        if (!sum || sum.tagName !== "SUMMARY") {
            sum = document.createElement("summary")
            sum.onclick = ()=>{ requestAnimationFrame(()=>{ updFocus(); }); }
        }
        elm.replaceChildren(sum)
        sum.innerText = attrs.question
        const txt = document.createElement("p")
        txt.innerText = attrs.answer
        txt.className = "faqtxt"
        elm.appendChild(txt)

        sum.style.backgroundColor = attrs.qu_bg_colour
        sum.style.textAlign = attrs.qu_align=="Centre"? "center" : attrs.qu_align.toLowerCase()
        txt.style.backgroundColor = attrs.ans_bg_colour
        txt.style.textAlign = attrs.ans_align=="Centre"? "center" : attrs.ans_align.toLowerCase()

        elm.style.maxWidth = attrs.width
        elm.style.minWidth = attrs.width
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "FAQ Item", bubble: true },
            { labl: "Width", type: "num", ...connval("width") },
            { labl: "Question", conts: [
                { labl: "Question", type: "multiline", ...connval("question") },
                { labl: "Background colour", type: "col", ...connval("qu_bg_colour") },
                { labl: "Horiz alignment", type: "opts", ...connval("qu_align"),
                    choices: ["Left", "Centre", "Right"] },
            ]},
            { labl: "Answer", conts: [
                { labl: "Answer", type: "multiline", ...connval("answer") },
                { labl: "Background colour", type: "col", ...connval("ans_bg_colour") },
                { labl: "Horiz alignment", type: "opts", ...connval("ans_align"),
                    choices: ["Left", "Centre", "Right"] },
            ]},
        null, ...super.spec]
    }
    static cls = "info"
}

// -----


const PageMixin = (Base) => class extends Base {
    static isObj = false
    constructor(name, conts, attrs) {
        super(name, attrs)
        this.conts = conts
        this.open = attrs?.open
    }

    get dirs() {
        return [
            "Column", "Column reverse",
            "Row", "Row reverse"
        ]
    }

    get _defaults() { return { ...super._defaults,
        page_gap: 18,
        page_direction: "Column",
        page_align_horiz: "Centre",
        page_align_vert: "Centre",
    }}

    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        elm.style.gap = attrs.page_gap + 'px'
        elm.style.flexDirection = attrs.page_direction.toLowerCase().replace(' ', '-')
        elm.style.alignItems = {
            Left: "baseline",
            Centre: "center",
            Right: "end",
        }[attrs.page_align_horiz]
        elm.style.justifyContent = {
            Top: "baseline",
            Centre: "center",
            Bottom: "end",
        }[attrs.page_align_vert]
    }

    _makeObject() {
        const elm = document.createElement("div")
        elm.className = "layout"
        this._style(elm)
        return elm
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Page", bubble: true },
            { labl: "Direction", type: "opts", ...connval("page_direction"),
                choices: this.dirs },
            { labl: "Spacing", type: "num", ...connval("page_gap"),
                step: 5 },
            { labl: "Alignment", conts: [
                { labl: "Horizontal", type: "opts", ...connval("page_align_horiz"),
                    choices: ["Left", "Centre", "Right"] },
                { labl: "Vertical", type: "opts", ...connval("page_align_vert"),
                    choices: ["Top", "Centre", "Bottom"] },
            ]},
        null, ...super.spec]
    }

    static cls = "dot"
    get sceneDef() {
        return { labl: this.name, class: this.constructor.cls,
            conts: this.conts, spec: this.spec }
    }
};

class BasePage extends PageMixin(BaseObj) {
    get spec() {
        // Because BaseObj.spec is empty, so this removes the extra line caused by PageMixin
        return super.spec.slice(0, -1)
    }
}
class Page extends PageMixin(Node2DObj) {
    get _defaults() { return { ...super._defaults,
        scale: 1,
    }}

    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        elm.style.scale = attrs.scale
    }

    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [...super.spec,
            { labl: "Scale", conts: [
                { labl: "Scale", type: "num", ...connval("scale"),
                    step: 0.02 },
            ]},
        ]
    }
}

// -----


class ButtonObj extends Node2DObj {
    get _defaults() { return { ...super._defaults,
        text: "Placeholder",
        text_size: 18,
        btn_onpress: ()=>{},
    }}
    _makeObject() {
        const elm = document.createElement("button")
        this._style(elm)
        return elm
    }
    _style(elm) {
        super._style(elm)
        const attrs = this.attrs
        elm.innerText = attrs.text
        elm.style.fontSize = `${attrs.text_size}px`
        elm.onclick = attrs.btn_onpress
    }
    get spec() {
        const connval = (nam)=>connectValue(this, nam)
        return [
            { labl: "Button", bubble: true },
            { labl: "Text", type: "line", ...connval("text") },
            { labl: "Run action", type: "btn", conn: this.attrs.btn_onpress },
        null, ...super.spec]
    }
    static cls = "btn"
}

// -----


class LoadingObj extends TextObj {
    constructor(what) { super("Loading "+what, {
        text: `Loading ${what}...`,
    }) }
    static cls = "load"
}
class ErrorObj extends TextObj {
    constructor(where) { super("Error "+where, {
        text: `An error occurred ${where}!`,
    }) }
    static cls = "error"
}
