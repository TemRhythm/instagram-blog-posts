export interface Post {
    title: string;
    slides: Slide[]
}

export interface Slide {
    title?: string,
    type: ContentType,
    content: string,
}

export type ContentType = "markdown" | "text";
