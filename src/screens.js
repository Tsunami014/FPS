const SCREENS = {
    home: [
        { labl: "Stage", open: true, conts: [
            { labl: "TitlePage", conts: [
                (new BannerObj("Announcements")).screenObj,
                (new ImageObj("BannerImage")).screenObj,
                (new TextObj("Title")).screenObj,
            ]},
            { labl: "AboutPage", conts: [
                (new SectionObj("WhatIsThis")).screenObj,
                (new SectionObj("HowThisWorks")).screenObj,
                (new SectionObj("IsHackClubReal")).screenObj,
                (new SectionObj("AmIEligible")).screenObj,
                (new SectionObj("HowToJoin")).screenObj,
            ]},
            { labl: "HelpSection", conts: [
                (new BackgroundObj("Background")).screenObj,
                (new FAQObj("FAQItem")).screenObj,
                (new FAQObj("FAQItem")).screenObj,
            ]},
        ]},
    ],
    projects: [
    ],
    shop: [
    ],
    settings: [
    ],
}
