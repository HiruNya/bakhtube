import {Skeleton, TreeSelect} from "antd";
import React, {useState} from "react";
import {Provider, useDispatch, useSelector} from "react-redux";
import {State, store} from "./redux/store";
import { useHistory } from "react-router-dom";

import {onSelect, toTree} from "./SectionSelector";

function SectionSearch() {
    return (
        <Provider store={store}>
            <SectionSearchInner />
        </Provider>
    )
}

function SectionSearchInner() {
    const [searchText, setSearchText] = useState<string | undefined>(undefined);
    const course = useSelector((state: State) => state.course)
    const sectionsMap = useSelector(((state: State) => state.sections.sections));
    const history = useHistory()
    const dispatch = useDispatch()

    const sectionsRaw = sectionsMap.get(course)
    if (!sectionsRaw) {
        return <Skeleton />
    }
    const sections = recursiveMap(toTree(Array.from(sectionsRaw)))

    return (
        <TreeSelect
            filterTreeNode
            treeNodeFilterProp={"title"}
            onSearch={setSearchText}
            onSelect={onSelect(sectionsRaw, history, dispatch)}
            placeholder={"Search For Sections Here..."}
            style={{width: "100%"}}
            searchValue={searchText}
            showSearch
            size={"large"}
            treeData={sections}
        />
    )
}

type DataNode = {key: string, title: string, children: DataNode[] }
type DataNodeAltered = {key: string, title: string, children: DataNodeAltered[], value: string}

function recursiveMap(nodes: DataNode[]): DataNodeAltered[] {
    return nodes.map((node) => {
        return {
            children: recursiveMap(node.children),
            key: node.key,
            value: node.key,
            title: node.title,
        }
    })
}

export default SectionSearch;
