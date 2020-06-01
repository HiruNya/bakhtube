import React, {useState} from "react"
import {Layout, PageHeader, Typography} from "antd"
import {SectionSelector} from "./SectionSelector"
import videojs from "video.js"
import "video.js/dist/video-js.css"
const {Content, Sider} = Layout
const {Text} = Typography;

function WatchPage() {
    const [player, setPlayer] = useState<videojs.Player | null>(null)
    function video(node: HTMLVideoElement) {
        if (!node && player) {
            player.dispose()
            console.log("Video Disposed")
        } else if (node && !player) {
            let player = videojs(node, videoOptions(), () => {console.log("Video Engaged")})
            setPlayer(player)
        }
    }

    return (
        <Layout>
            <Sider style={{padding: "10pt"}} collapsible collapsedWidth={0} trigger={null}>
                <Text strong>Select a Section</Text>
                <SectionSelector/>
            </Sider>
            <Content style={{paddingLeft: "10pt", paddingRight: "10pt", paddingBottom: "10pt"}}>
                <PageHeader title="Section Name"/>
                <div data-vjs-player>
                    <video ref={video} className="video-js"/>
                </div>
            </Content>
        </Layout>
    )
}

function videoOptions(src: string = "//vjs.zencdn.net/v/oceans.mp4") {
    return {
        width: 720,
        height: 600,
        controls: true,
        sources: [
            {
                // src: '',
                src,
                type: 'video/mp4',
            },
        ],
    }
}

export default WatchPage
