import React from "react";

export function Pagination(props: {currentIndex: number, total: number}) {
    return <div className="pagination">
        {
            new Array(props.total)
            .fill(null)
            .map((item, index) =>
                <div
                    key={index}
                    className={`pagination__item${index === props.currentIndex ? ' pagination__item--current' : ''}`}
                ></div>
            )
        }
    </div>
}
