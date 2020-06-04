import {AnyAction} from "redux"
import {ThunkDispatch} from "redux-thunk"
import api from "../api";

const GET_VIDEO: string = "GET_VIDEO"
const LOADING_VIDEO: string = "LOADING_VIDEO"
const IS_LOADING: string = "LOADING"

export type VideoMap = Map<string, Map<string, Video | typeof IS_LOADING>>

type GetVideoAction = {
    type: typeof GET_VIDEO,
    course: string,
    video: Video,
    videoId: string,
}

type LoadingVideoAction = {
    type: typeof LOADING_VIDEO,
    course: string,
    videoId: string,
}

export type Video = {
    id: string,
    internal?: string,
    subtitles?: string,
    next?: string,
    previous?: string,
}

type VideoActions = GetVideoAction | LoadingVideoAction

function videoReducer(state: VideoMap = new Map(), action: VideoActions) {
    switch (action.type) {
        case LOADING_VIDEO: {
            const courses = new Map(state)
            const course = courses.get(action.course)
            let videos;
            if (course) {
                videos = new Map(course)
            } else {
                videos = new Map()
            }
            if (videos.get(action.videoId) == null) {
                videos.set(action.videoId, IS_LOADING)
            }
            courses.set(action.course, videos)
            return courses
        }
        case GET_VIDEO: {
            const getAction = action as GetVideoAction
            const courses = new Map(state)
            const course = courses.get(getAction.course)
            let videos;
            if (course) {
                videos = new Map(course)
            } else {
                videos = new Map()
            }
            videos.set(getAction.videoId, getAction.video)
            courses.set(getAction.course, videos)
            return courses
        }
    }
    return state
}

function updateVideo(course: string, video: Video, videoId: string | undefined): GetVideoAction {
    if (!videoId) {
        videoId = video.id
    }
    return {
        type: GET_VIDEO,
        course,
        video,
        videoId,
    }
}

function loadingVideo(course: string, videoId: string): LoadingVideoAction {
    return {
        type: LOADING_VIDEO,
        course,
        videoId,
    }
}

function requestVideo(course: string, videoId: string) {
    return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        dispatch(loadingVideo(course, videoId))
        api(`classes/${course}/videos/${videoId}`)
            .then((video) => dispatch(updateVideo(course, video, videoId)))
    }
}

export { requestVideo, videoReducer, updateVideo }
