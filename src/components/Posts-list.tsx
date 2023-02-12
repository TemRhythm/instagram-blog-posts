import React from "react";
import {Post as IPost} from "../models/post";
import {Button, Layout, Menu, MenuProps} from "antd";
import {FileImageOutlined} from "@ant-design/icons";
import {downloadSlides} from "../business-logic/download";
import {Post} from "./Post";

const { Sider } = Layout;

interface PostListState {
    list: string[];
    current: IPost;
    currentPostSlug: string;
    isDownloading: boolean;
}

export class PostsList extends React.Component<unknown, PostListState> {
    slidesEl = React.createRef<HTMLDivElement>();
    componentDidMount() {
        fetch(`/data/posts/list.json`)
            .then(response => response.json())
            .then(respData => {
                this.setState({
                    list: respData,
                    isDownloading: false,
                    currentPostSlug: window.location.hash?.slice(1)
                });
                if (window.location.hash) {
                    this.selectPost(window.location.hash.slice(1));
                }
            });
    }

    setPostList() {
        this.state.list.map((li, index) => ({
            key: String(index + 1),
            icon: <FileImageOutlined/>,
            label: li,
            onClick: () => this.selectPost(li)
        }))
    }

    getDefaultSelectedMenuItemsKeys(): string[] {
        return [String(this.state.list.indexOf(this.state.currentPostSlug) + 1)];
    }

    selectPost(slug: string) {
        fetch(`/data/posts/${slug}/data.json`)
            .then(response => response.json())
            .then(respData => {
                window.location.hash = `#${slug}`
                    this.setState(state => ({
                        ...state,
                        current: respData,
                        currentPostSlug: slug,
                    }));
                }
            )
    }

    async downloadSlidesHandle() {
        if (!this.slidesEl.current) {
            return;
        }
        this.setState(state => ({
            ...state,
            isDownloading: true
        }));
        await downloadSlides(this.slidesEl.current, this.state.currentPostSlug);
        this.setState(state => ({
            ...state,
            isDownloading: false
        }));
    }

    render() {
        if (this.state?.list) {
            let post = this.state.current
                ? <Post ref={this.slidesEl} post={this.state?.current} slug={this.state?.currentPostSlug}/>
                : null;
            let postList: MenuProps['items'] = this.state.list.map((li, index) => ({
                key: String(index + 1),
                icon: <FileImageOutlined/>,
                label: li,
                onClick: () => this.selectPost(li)
            }))

            return <Layout hasSider>
                <Sider className="sider-fixed sider-fixed-left">
                    <Menu
                        theme="dark"
                        mode="inline"
                        items={postList}
                        defaultSelectedKeys={this.getDefaultSelectedMenuItemsKeys()}
                    />
                </Sider>
                {post}
                <Sider className="sider-fixed sider-fixed-right">
                    <div className="post-actions">
                        <Button
                            block
                            type="primary"
                            loading={this.state.isDownloading}
                            onClick={() => this.downloadSlidesHandle()}
                            disabled={!this.state.current}
                        >Download slides</Button>
                    </div>
                </Sider>
            </Layout>;
        }
    }
}
