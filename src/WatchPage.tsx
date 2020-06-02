import {Layout, PageHeader, Skeleton, Typography} from "antd"
import React, {ReactElement, useState} from "react"
import {useRouteMatch} from "react-router-dom"
import {SectionSelector} from "./SectionSelector"
import {useDispatch, useSelector} from "react-redux";
import {State} from "./redux/store";
import api from "./api";
import {updateVideo, Video} from "./redux/videos";
const {Content, Sider} = Layout
const {Text, Title} = Typography;

function WatchPage() {
    const [loading, setLoading] = useState(false)
    const course = useSelector((state: State) => {return state.course})
    const route = useRouteMatch("/watch/:videoId")
    const currentSection = useSelector((state: State) => {return state.sections.current})
    const params = route?.params as {videoId: string};
    const videos = useSelector((state: State) => {return state.videos})
    const possibleCurrentVideo = videos.get(course)?.get(params.videoId)
    const dispatch = useDispatch()

    if (loading) {
        return <Skeleton />
    }
    if (possibleCurrentVideo === undefined) { // Hasn't been retrieved yet
        console.log(videos)
        api(`classes/${course}/videos/${params.videoId}`)
            .then((video) => dispatch(updateVideo(course, video, params.videoId)))
            .then(() => console.log("dispatched"))
            .then(() => setLoading(false))
        setLoading(true)
        return render(<Skeleton />)
    }
    if (possibleCurrentVideo === null) { // No such value exists
        return render(<Title level={3}>We can't seem to find that video</Title>)
    }

    const currentVideo = possibleCurrentVideo as Video
    let subtitleSource: string | null = null
    if (currentVideo.subtitles) {
        subtitleSource = `https://bakhtube.hiru.dev/media/${course}/subtitles/${currentVideo.subtitles}`
    }
    const videoSource = `https://bakhtube.hiru.dev/media/${course}/videos/${currentVideo.internal}`

    return render(
        <>
        <PageHeader title={currentSection}/>
        <video controls style={{width: "100%"}}>
            <source src={videoSource} type="video/mp4"/>
            { (subtitleSource) &&
                <track label="English" kind="subtitles" srcLang="en" src={subtitleSource} default />
            }
        </video>
        </>
    )
}

function render(element: ReactElement) {
    return (
        <Layout>
            <Sider style={{padding: "10pt"}} collapsible collapsedWidth={0} trigger={null} breakpoint="md">
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
