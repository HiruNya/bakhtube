const GET_SECTIONS: string = "GET_SECTIONS"
const SET_SECTION: string = "SET_SECTION"

export type Sections = {
    current: { name: string, timestamp?: number } | null,
    sections: {[key:string]: {[key: string]: Section}},
}

type GetSectionsAction = {
    type: typeof GET_SECTIONS,
    course: string,
    sections: Array<Section>,
}

type SetSectionAction = {
    type: typeof SET_SECTION,
    section: string | null,
    timestamp?: number,
}

export type Section = {
    id: string,
    name: string,
    video: string,
    timestamp?: number,
    major: number,
    minor?: number,
    detail?: number,
}

const INITIAL_STATE: Sections = {
    current: null,
    sections: {},
}

type SectionAction = GetSectionsAction | SetSectionAction

function sectionReducer(state: Sections = INITIAL_STATE, action: SectionAction): Sections {
    switch (action.type) {
        case GET_SECTIONS:
            action = action as GetSectionsAction
            const sections = {...state.sections}
            const sectionMap: {[key: string]: Section} = {}
            action.sections.forEach((section) => {
                let key = section.major.toString()
                if (section.minor) { key = key + '.' + section.minor }
                if (section.minor && section.detail) { key = key + '.' + section.detail }
                sectionMap[key] = section
            })
            sections[action.course] = sectionMap
            return { ...state, sections }
        case SET_SECTION:
            action = action as SetSectionAction
            let current = null;
            if (action.section) {
                current = {name: action.section, timestamp: action.timestamp}
            }
            return {...state, current}
    }
    return state
}

function updateSections(course: string, sections: Array<Section>): GetSectionsAction {
    return {
        type: GET_SECTIONS,
        course,
        sections,
    }
}

function setSection(section: string | null, timestamp?: number): SetSectionAction {
    return  {
        type: SET_SECTION,
        section,
        timestamp,
    }
}

export { sectionReducer, setSection, updateSections }
