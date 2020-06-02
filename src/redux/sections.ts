const GET_SECTIONS: string = "GET_SECTIONS"
const SET_SECTION: string = "SET_SECTION"

export type Sections = {
    current: string | null,
    sections: Map<string, Array<Section>>,
}

type GetSectionsAction = {
    type: typeof GET_SECTIONS,
    course: string,
    sections: Array<Section>,
}

type SetSectionAction = {
    type: typeof SET_SECTION,
    section: string,
}

export type Section = {
    id: string,
    name: string,
    video: string,
    timestamp?: string,
    major: number,
    minor?: number,
    detail?: number,
}

const INITIAL_STATE: Sections = {
    current: null,
    sections: new Map(),
}

function sectionReducer(state: Sections = INITIAL_STATE, action: GetSectionsAction | SetSectionAction): Sections {
    switch (action.type) {
        case GET_SECTIONS:
            action = action as GetSectionsAction
            const sections = new Map(state.sections)
            sections.set(action.course, action.sections)
            return { ...state, sections }
        case SET_SECTION:
            action = action as SetSectionAction
            return { ...state, current: action.section }
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

function setSection(section: string): SetSectionAction {
    return  {
        type: SET_SECTION,
        section,
    }
}

export { sectionReducer, setSection, updateSections }
