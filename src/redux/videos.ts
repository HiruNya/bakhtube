import {AnyAction} from "redux"
import {ThunkDispatch} from "redux-thunk"
import api from "../api"

const GET_VIDEO: string = "GET_VIDEO"
const LOADING_VIDEO: string = "LOADING_VIDEO"
const IS_LOADING: string = "LOADING"

export type VideoMap = {[key: string]: {[key: string]: Video | typeof IS_LOADING}}

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

function videoReducer(state: VideoMap = {}, action: VideoActions) {
    switch (action.type) {
        case LOADING_VIDEO: {
            const courses = {...state}
            const course = courses[action.course]
            let videos;
            if (course) {
                videos = {...course}
            } else {
                videos = {}
            }
            if (videos[action.videoId] == null) {
                videos[action.videoId] = IS_LOADING
            }
            courses[action.course] = videos
            return courses
        }
        case GET_VIDEO: {
            const getAction = action as GetVideoAction
            const courses = {...state}
            const course = courses[getAction.course]
            let videos;
            if (course) {
                videos = {...course}
            } else {
                videos = {}
            }
            videos[getAction.videoId] = getAction.video
            courses[getAction.course] = videos
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

function requestVideo(course: string, videoId: string, token: string) {
    return (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
        dispatch(loadingVideo(course, videoId))
        api<Video, {}>(`classes/${course}/videos/${videoId}`, null, token)
            .then((video) => {
                if (video != null) {
                    dispatch(updateVideo(course, video, videoId))
                } else {
                    console.error(`Could not find video '${videoId}' in '${course}'`)
                }
            })
    }
}

export { requestVideo, videoReducer, updateVideo }
