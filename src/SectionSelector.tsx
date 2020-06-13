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


    return (
        <Tree treeData={treeData} onSelect={onSelect(sections, history, dispatch)} defaultExpandAll selectable/>
    );
}

type DataNode = {
    key: string,
    title: string,
    children: Array<DataNode>,
}

function onSelect(sections: Map<string, Section>, history: any, dispatch: Function) {
    return (keys: Array<ReactText> | ReactText, _: {}) => {
        let key: string;
        if (keys instanceof Array && keys.length !== 0) {
            key = keys[0] as string
        } else { // If it's not an array, it must be a single key
            key = keys as string
        }
        const section = sections.get(key)
        if (section) {
            history.push(`/watch/${section.video}`)
            dispatch(setSection(section.name, section.timestamp))
        } else {
            console.error(`Could not find section with key: ${key}`)
        }
    }
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

export {onSelect, SectionSelector, toTree};
