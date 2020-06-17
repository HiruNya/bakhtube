import {Button, Col, Layout, PageHeader, Row, Skeleton, Slider, Space, Switch, Typography} from "antd"
import React, {MutableRefObject, ReactElement, SetStateAction, useRef, useState} from "react"
import {useHistory, useRouteMatch} from "react-router-dom"
import {SectionSelector} from "./SectionSelector"
import {useDispatch, useSelector} from "react-redux"
import {State, store} from "./redux/store"
import {requestVideo, Video} from "./redux/videos"
import {Dispatch} from "redux"
import {setSection} from "./redux/sections"
import {setSpeed} from "./redux/playerSettings";
const {Content, Sider} = Layout
const {Text, Title} = Typography

function WatchPage() {
    const course = useSelector((state: State) => {return state.course})
    const route = useRouteMatch("/watch/:videoId")
    const currentSection = useSelector((state: State) => {return state.sections.current})
    const params = route?.params as {videoId: string}
    const videos = useSelector((state: State) => {return state.videos})
    const possibleCurrentVideo = videos[course]?.[params.videoId]
    const videoElement = useRef<HTMLVideoElement | null>(null)
    const [autoplay, setAutoplay] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const auth = useSelector((state: State) => state.auth)

    let token: string
    if (auth.state === 'AUTHENTICATED') {
        token = auth.token
    } else {
        history.replace("/login")
    }
    if (possibleCurrentVideo === undefined) { // Hasn't been retrieved yet
        dispatch(requestVideo(course, params.videoId, token!))
        return render(<Skeleton />)
    } else if (possibleCurrentVideo === "LOADING") { // Loading
        return render(<Skeleton />)
    } else if (possibleCurrentVideo === null) { // No such value exists
        return render(<Title level={3}>We can't seem to find that video</Title>)
    }

    const currentVideo = possibleCurrentVideo as Video
    let subtitleSource: string | null = null
    if (currentVideo.subtitles) {
        subtitleSource = `https://bakhtube.hiru.dev/media/${course}/subtitles/${currentVideo.subtitles}`
    }
    const videoSource = `https://bakhtube.hiru.dev/media/${course}/videos/${currentVideo.internal}`

    return render(
        <div style={{margin: "0 auto", width: "50%"}}>
        <div style={{width: "100%", maxWidth: "720pt"}}>
            <Row>
                <Col flex={1}>
                    <PageHeader title={currentSection?.name}/>
                    <video controls
                        autoPlay={autoplay}
                        ref={onVideoCreated(videoElement, videoSource, currentSection?.timestamp)}
                        style={{width: "100%"}}
                        onEnded={nextVideo(history, dispatch, currentVideo, autoplay)}>
                            <source src={videoSource} type="video/mp4"/>
                            {(subtitleSource) &&
                            <track label="English" kind="subtitles" srcLang="en" src={subtitleSource} default/>
                            }
                    </video>
                </Col>
            </Row>
            <Row gutter={30}>
                <Col style={{textAlign: "left"}}>
                    <Button disabled={currentVideo.previous == null} onClick={goToVideo(history, dispatch, currentVideo.previous)}>Previous</Button>
                    <Button disabled={currentVideo.next  == null} onClick={goToVideo(history, dispatch, currentVideo.next)}>Next</Button>
                </Col>
                <Col flex="auto">
                    <SpeedSlider videoRef={videoElement} />
                </Col>
                <Col style={{textAlign: "right", margin: "auto"}}>
                    <Space>
                    <Text>Autoplay</Text>
                    <Switch checked={autoplay} onChange={(state) => setAutoplay(state)}/>
                    </Space>
                </Col>
            </Row>
        </div>
        </div>
    );
}

function onVideoCreated(videoElement: MutableRefObject<HTMLVideoElement | any>, videoSource: string, timestamp?: number | null): (video: HTMLVideoElement) => void {
    const timestamp_ = (timestamp)? timestamp: 0
    return (video) => {
        if (video) {
            if (video.src !== videoSource) {
                video.src = videoSource
            }
            video.currentTime = timestamp_
            video.playbackRate = (store.getState() as unknown as State).playerSettings.speed
            videoElement.current = video
        }
    }
}

function goToVideo(history: any, dispatch: Dispatch, video?: string) {
    if (video) {
        return () => {
            history.push(`/watch/${video}`)
            dispatch(setSection(null, 0))
        }
    }
    return () => {}
}

function nextVideo(history: any, dispatch: Dispatch, currentVideo: Video, autoplay: boolean) {
    if (autoplay) {
        return goToVideo(history, dispatch, currentVideo.next)
    }
    return () => {}
}

function SpeedSlider(props: {videoRef: MutableRefObject<HTMLVideoElement | null>}): ReactElement {
    const [speed, setSpeed] = useState((store.getState() as unknown as State).playerSettings.speed)
    const dispatch = useDispatch()

    return (
        <Row style={{paddingRight: "1%"}}>
            <Col style={{margin: "auto"}}>
                <Text style={{}}>Speed</Text>
            </Col>
            <Col flex="auto">
                <Slider
                    min={0.1} max={4.0}
                    step={0.1}
                    value={speed}
                    onChange={setPlaybackRate(setSpeed, props.videoRef)}
                    onAfterChange={onAfterChange(dispatch)}
                    style={{width: "95%"}}
                />
            </Col>
        </Row>
    )
}

function setPlaybackRate(setter: React.Dispatch<SetStateAction<number>>, videoElement: MutableRefObject<HTMLVideoElement | null>): (value: number | [number, number]) => void {
    return (value) => {
        if (typeof value == "number") {
            setter(value)
            if (videoElement.current != null) {
                videoElement.current.playbackRate = value
            }
        } else {
            console.error("Could not set playback rate: expected value of type `number`.")
        }
    }
}

function onAfterChange (dispatch: Dispatch): (value: number | [number, number]) => void {
    return (value) => {
        if (typeof value == "number") {
            dispatch(setSpeed(value))
        } else {
            console.error("Could  not set initial playback speed: expected value of type `number`.")
        }
    }
}

function render(element: ReactElement) {
    return (
        <Layout>
            <Sider style={{padding: "10pt"}} width={"20%"} collapsible collapsedWidth={0} trigger={null} breakpoint="md">
                <Text strong>Select a Section</Text>
                <SectionSelector/>
            </Sider>
            <Content style={{paddingLeft: "10pt", paddingRight: "10pt", paddingBottom: "10pt"}}>
                {element}
            </Content>
        </Layout>
    )
}

export default WatchPage
