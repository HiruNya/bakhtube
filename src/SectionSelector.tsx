import {Tree} from "antd"
import React, {ReactText} from "react"
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom"

import {State} from "./redux/store";
import {Section, setSection} from "./redux/sections";

function SectionSelector() {
    const history = useHistory()
    const course = useSelector((state: State) => {return state.course})
    const sections = useSelector((state: State) => {return state.sections.sections.get(course)})
    const dispatch = useDispatch();

    let treeData: Array<DataNode>
    let sectionMap = new Map<string, Section>()
    if (sections) {
        treeData = sections.map((section) => {
            const key = section.major.toString()
                + ((section.minor)?`.${section.major}`:'')
                + ((section.minor && section.detail)?`.${section.detail}`:'')
            sectionMap.set(key, section)
            return {
                title: section.name,
                key,
                children: [],
            }
        })
    } else {
        treeData = []
    }

    function onSelect(keys: Array<ReactText>, _: {}) {
        if (keys.length !== 0) {
            const video = sectionMap.get(keys[0] as string)
            if (video) {
                history.push(`/watch/${video.video}`)
                dispatch(setSection(video.name))
            } else {
                console.error(`Could not find section with key: ${keys[0]}`)
            }
        }
    }

    return (
        <Tree treeData={treeData} onSelect={onSelect} selectable/>
    );
}

type DataNode = {
    key: string,
    title: string,
    children: Array<DataNode>,
}

export {SectionSelector};
