
export type Course = string

const UPDATE_COURSE: string = "UPDATE_COURSE"

type UpdateCourseAction = {
    type: typeof UPDATE_COURSE,
    course: string,
}

function courseReducer(state: Course = "softeng250", action: UpdateCourseAction): Course {
    if (action.type === UPDATE_COURSE) {
        return action.course
    }
    return state
}

function updateCourse(course: string): UpdateCourseAction {
    return {
        type: UPDATE_COURSE,
        course,
    }
}

export {courseReducer}
