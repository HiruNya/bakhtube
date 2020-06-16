import {Button, Col, Layout, PageHeader, Row, Skeleton, Space, Switch, Typography} from "antd"
import React, {ReactElement, useState} from "react"
import {useHistory, useRouteMatch} from "react-router-dom"
import {SectionSelector} from "./SectionSelector"
import {useDispatch, useSelector} from "react-redux"
import {State} from "./redux/store"
import {requestVideo, Video} from "./redux/videos"
import {Dispatch} from "redux"
import {setSection} from "./redux/sections"
const {Content, Sider} = Layout
const {Text, Title} = Typography

function WatchPage() {
    const course = useSelector((state: State) => {return state.course})
    const route = useRouteMatch("/watch/:videoId")
    const currentSection = useSelector((state: State) => {return state.sections.current})
    const params = route?.params as {videoId: string}
    const videos = useSelector((state: State) => {return state.videos})
    const possibleCurrentVideo = videos[course]?.[params.videoId]
    const [autoplay, setAutoplay] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()

    if (possibleCurrentVideo === undefined) { // Hasn't been retrieved yet
        dispatch(requestVideo(course, params.videoId))
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
                        ref={onVideoCreated(videoSource, currentSection?.timestamp)}
                        style={{width: "100%"}}
                        onEnded={nextVideo(history, dispatch, currentVideo, autoplay)}>
                            <source src={videoSource} type="video/mp4"/>
                            {(subtitleSource) &&
                            <track label="English" kind="subtitles" srcLang="en" src={subtitleSource} default/>
                            }
                    </video>
                </Col>
            </Row>
            <Row>
                <Col flex={1} style={{textAlign: "left"}}>
                    <Button disabled={currentVideo.previous == null} onClick={goToVideo(history, dispatch, currentVideo.previous)}>Previous</Button>
                    <Button disabled={currentVideo.next  == null} onClick={goToVideo(history, dispatch, currentVideo.next)}>Next</Button>
                </Col>
                <Col flex={1} style={{textAlign: "right"}}>
                    <Space>
                    Autoplay
                    <Switch checked={autoplay} onChange={(state) => setAutoplay(state)}/>
                    </Space>
                </Col>
            </Row>
        </div>
        </div>
    );
}

function onVideoCreated(videoSource: string, timestamp?: number | null): (video: HTMLVideoElement) => void {
    const timestamp_ = (timestamp)? timestamp: 0
    return (video) => {
        if (video) {
            if (video.src !== videoSource) {
                video.src = videoSource
            }
            video.currentTime = timestamp_
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

const nextVideo = (history: any, dispatch: Dispatch, currentVideo: Video, autoplay: boolean) => {
    if (autoplay) {
        return goToVideo(history, dispatch, currentVideo.next)
    }
    return () => {}
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
