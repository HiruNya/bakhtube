import {Skeleton, Tree} from "antd"
import React, {ReactText} from "react"
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom"

import {State} from "./redux/store";
import {Section, setSection} from "./redux/sections";

function SectionSelector() {
    const history = useHistory()
    const course = useSelector((state: State) => {return state.course})
    const sectionsMap = useSelector((state: State) => {return state.sections.sections})
    const dispatch = useDispatch();

    const maybeSections = sectionsMap.get(course)
    if (maybeSections == null) {
        return <Skeleton />
    }
    const sections = maybeSections as Map<string, Section>

    const treeData = toTree(Array.from(sections))

    function onSelect(keys: Array<ReactText>, _: {}) {
        if (keys.length !== 0) {
            const video = sections.get(keys[0] as string)
            if (video) {
                history.push(`/watch/${video.video}`)
                dispatch(setSection(video.name, video.timestamp))
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

function toTree(sections: Array<[string, Section]>): Array<DataNode> {
    type HybridSection = Section & { children: Array<HybridSection>, key: string }

    const hybridSections = sections.sort(([_k1, a], [_k2, b]) => {
        const major = a.major - b.major
        if (major !== 0) {
            return major
        }
        const minor = ((a.minor)? a.minor: 0) - ((b.minor)? b.minor: 0)
        if (minor !== 0) {
            return minor
        }
        return ((a.detail)? a.detail: 0) - ((b.detail)? b.detail: 0)
    }).reduce((accumulator, [key, section]) => {
        const last = accumulator[accumulator.length - 1]
        const currentSection = {
            key,
            children: [],
            ...section,
            name: key + '. ' + section.name
        }
        if (last && last.major === currentSection.major) {
            let added: boolean = false
            for (let child of last.children) {
                if (((child.minor)? child.minor: 0) === ((currentSection.minor)? currentSection.minor: 0)) {
                    child.children.push(currentSection)
                    added = true
                    break
                }
            }
            if (!added) {
                last.children.push(currentSection)
            }
        } else {
            accumulator.push(currentSection)
        }
        return accumulator
    }, new Array<HybridSection>())

    function recursiveMap(sections: Array<HybridSection>): Array<DataNode> {
        return sections.map((section) => {
            return {
                key: section.key,
                title: section.name,
                children: recursiveMap(section.children)
            }
        })
    }

    return recursiveMap(hybridSections)
}

export {SectionSelector};
