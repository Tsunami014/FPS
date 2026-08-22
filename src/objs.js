const OBJS = {
    image: [
        { labl: "Image", bubble: true, conts: [
            { labl: "Transform", conts: [
                { labl: "Transform", type: "labl" },
                { labl: "Test", type: "btn" },
            ]},
        ]},
    ],
    object: [
        { labl: "Object", bubble: true, conts: [
        ]},
    ],
}

const SCREENS = {
    home: [
        { labl: "Stage", open: true, conts: [
            { labl: "Obj", class: "object" },
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
