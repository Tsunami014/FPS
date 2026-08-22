const SCREENS = {
    home: [
        { labl: "Stage", open: true, conts: [
            (new TestObj("Test")).screenObj()
            { labl: "Hello", conts: [
                { labl: "Obj", class: "image" },
            ]},
            (new InfoObj("Test")).screenObj()
        ]},
    ],
    projects: [
        { labl: "Stage", open: true, conts: [
            { labl: "Test", class: "image" },
        ]},
    ],
    shop: [

    ],
    settings: [

    ],
}
