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

const SCREENS = {
    home: [
        { labl: "Stage", open: true, conts: [
            (new TestObj("Test")).screenObj()
            { labl: "Hello", conts: [
                { labl: "Obj", class: "image" },
            ]},
        ]},
    ],
    projects: [
        { labl: "Stage", open: true, conts: [
            { labl: "Test", class: "image" },
        ]},
    ],
}
