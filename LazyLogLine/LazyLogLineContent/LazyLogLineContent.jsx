import React, { Component } from "react";
import { arrayOf, func, number, object, shape, string } from "prop-types";
import { LazyLogLineContentPart } from "./LazyLogLineContentPart/LazyLogLineContentPart";
import { lineContent } from "./LazyLogLineContent.module.css";

/* eslint-disable react/no-array-index-key */

/**
 * The container of all the individual pieces of content that
 * is on a single line. May contain one or more `LinePart`s
 * depending on ANSI parsing.
 */
export class LazyLogLineContent extends Component {
  static propTypes = {
    /**
     * The pieces of data to render in a line. Will typically
     * be multiple items in the array if ANSI parsed prior.
     */
    data: arrayOf(
      shape({
        text: string,
      })
    ).isRequired,
    /**
     * The line number being rendered.
     */
    number: number.isRequired,
    /**
     * Execute a function against each line part's
     * `text` property in `data` to process and
     * return a new value to render for the part.
     */
    formatPart: func,
    style: object,
  };

  static defaultProps = {
    formatPart: null,
    style: null,
  };

  render() {
    const { data, formatPart, number, style, content, color } = this.props;

    if (data) {
      const last = data[data.length - 1];

      if (last && typeof last.text === "string" && !last.text.endsWith("\n")) {
        last.text += "\n";
      }
    }

    return (
      <span className={lineContent} style={style}>
        {data &&
          data.map((part, n) => (
            <LazyLogLineContentPart
              part={part}
              format={formatPart}
              key={`line-${number}-${n}`}
              content={content}
              color={color}
            />
          ))}
      </span>
    );
  }
}
