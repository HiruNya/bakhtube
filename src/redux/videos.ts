const GET_VIDEO: string = "GET_VIDEO"

export type VideoMap = Map<string, Map<string, Video>>

type GetVideoAction = {
    type: typeof GET_VIDEO,
    course: string,
    video: Video,
}

type Video = {
    id: string,
    name: string,
    video: string,
    timestamp?: string,
    major: number,
    minor?: number,
    detail?: number,
}

function videoReducer(state: VideoMap = new Map(), action: GetVideoAction) {
    switch (action.type) {
        case GET_VIDEO:
            const courses = new Map(state)
            const course = courses.get(action.course)
            let videos;
            if (course) {
                videos = new Map(course)
            } else {
                videos = new Map()
            }
            videos.set(action.video.id, action.video)
            courses.set(action.course, videos)
            return courses
    }
    return state
}

function updateVideo(course: string, video: Video): GetVideoAction {
    return {
        type: GET_VIDEO,
        course,
        video,
    }
}

export { videoReducer, updateVideo }
