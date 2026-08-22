class InfoObj {
    constructor(name) {
        this.name = name;
    }

    screenObj() {
        return { labl: this.name, class: "info", spec: [
            { labl: "Image", bubble: true, conts: [
                { labl: "Transform", conts: [
                    { labl: "Transform", type: "labl" },
                    { labl: "Test", type: "btn" },
                ]},
            ]},
        ]}
    }
}

class TestObj {
    constructor(name) {
        this.name = name;
    }

    screenObj() {
        return { labl: this.name, class: "object", spec: [
            { labl: "Image", bubble: true, conts: [
                { labl: "Transform", conts: [
                    { labl: "Transform", type: "labl" },
                    { labl: "Test", type: "btn" },
                ]},
            ]},
        ]}
    }
}
