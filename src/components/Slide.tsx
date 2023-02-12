import React from "react";
import showdown from "showdown";
import {Slide as ISlide} from '../models/post';
import {Pagination} from "./Pagination";


const mdConverter = new showdown.Converter();
mdConverter.setOption('tables', true);
interface SlideProps {
    slide: ISlide | string;
    type: "intro" | "outro" | "content";
    slug?: string;
    paginationData: {
        total: number;
        currentIndex: number;
    }
}

interface SlideState {
    content: string;
}

export class Slide extends React.Component<SlideProps, SlideState> {
    constructor(props: SlideProps) {
        super(props);
        let slideContent: string;
        if (typeof this.props.slide === "string") {
            slideContent = this.props.slide;
        } else if (this.props.slide.type === "text") {
            slideContent = this.props.slide.content;
        } else {
            slideContent = 'Loading...';
        }
        this.state = {
            content: `<p>${slideContent}</p>`
        }
    }
    componentDidMount() {
        if(typeof this.props.slide === "object" &&
            this.props.slide.type === "markdown"
        ) {
            fetch(`/data/posts/${this.props.slug}/${(this.props.slide as ISlide).content}`)
                .then(response => response.text())
                .then(mdContent => {
                    this.setState(state => ({
                        ...state,
                        content: this.markdownToHtml(mdContent)
                    }));
                })
        }
    }
    private markdownToHtml(content: string) {
        return mdConverter.makeHtml(content);
    }
    render() {
        const title = typeof this.props.slide === 'string' ? '' : this.props.slide.title;
        return <div className="slide-wrapper">
            <div className={`slide${this.props.type === 'content' ? '' : ' slide--' + this.props.type}`}>
                <Pagination
                    currentIndex={this.props.paginationData.currentIndex}
                    total={this.props.paginationData.total}
                />
                <img className="slide__logo" src={"img/js-logo.svg"} alt="JS"/>
                <div className="slide__title">{title}</div>
                <div className="slide__content" dangerouslySetInnerHTML={{__html: this.state.content}}></div>
            </div>
        </div>
    }
}
