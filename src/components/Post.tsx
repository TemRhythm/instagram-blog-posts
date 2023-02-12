import React, {ForwardedRef} from "react";
import {Post as IPost} from "../models/post";
import {Slide} from "./Slide";
import {Layout} from "antd";

const { Content } = Layout;

export const Post = React.forwardRef((props: { slug: string, post: IPost }, ref: ForwardedRef<HTMLDivElement>) => {
    const outroText = 'More about JavaScript you can read in my Instagram channel. Like ❤️, save, and follow for more information about JS and frontend'
    const total = props.post.slides.length + 2;

    return <>
        <Layout className="site-layout">
            <Content className="content">
                <div className="slides" ref={ref}>
                    <Slide slide={props?.post?.title} type={"intro"} paginationData={{currentIndex: 0, total: total}}/>
                    {props.post?.slides?.map((slide, index) =>
                        <Slide
                            key={index}
                            paginationData={{currentIndex: index + 1, total: total}}
                            slide={slide}
                            type="content"
                            slug={props?.slug} />
                    )}
                    <Slide
                        slide={outroText}
                        type={"outro"}
                        paginationData={{currentIndex: total - 1, total: total}}
                    />
                </div>
            </Content>
        </Layout>
    </>
});
