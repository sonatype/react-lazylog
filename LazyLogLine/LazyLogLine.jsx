import React, { Component } from "react";
import { arrayOf, bool, func, number, object, shape, string } from "prop-types";
import { LazyLogLineNumber } from "./LazyLogLineNumber/LazyLogLineNumber";
import { LazyLogLineContent } from "./LazyLogLineContent/LazyLogLineContent";
import {
  line,
  lineHighlight,
  lineSelectable,
  lineDepthBar,
  lineDepthHead,
  lineDepthHeadExpanded,
} from "./LazyLogLine.module.css";

/**
 * A single row of content, containing both the line number
 * and any text content within the line.
 */
export class LazyLogLine extends Component {
  static propTypes = {
    data: arrayOf(
      shape({
        text: string,
      })
    ).isRequired,
    number,
    rowHeight: number,
    highlight: bool,
    selectable: bool,
    style: object,
    formatPart: func,
    onLineNumberClick: func,
    onRowClick: func,
    className: string,
    highlightClassName: string,
  };

  static defaultProps = {
    highlight: false,
    selectable: false,
    style: {},
    formatPart: null,
    onLineNumberClick: null,
    onRowClick: null,
    className: "",
    highlightClassName: "",
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { isOpen, updateRowHeight } = this.props;
    if (prevProps.isOpen !== isOpen) {
      updateRowHeight();
    }
  }

  render() {
    const {
      data,
      formatPart,
      highlight,
      selectable,
      onLineNumberClick,
      onRowClick,
      number,
      rowHeight,
      style,
      className,
      highlightClassName,
      lineData,
      isOpen,
      isExpanded,
      toggleOpenTopic,
    } = this.props;
    const selectableClass = selectable ? ` ${lineSelectable}` : "";
    const highlightClass = highlight
      ? ` ${lineHighlight} ${highlightClassName}`
      : "";
    const classes = `${line}${selectableClass}${highlightClass} ${className}`;
    const lineStyle = {
      ...style,
      lineHeight: `${style ? style.height || rowHeight : rowHeight}px`,
      minWidth: style ? style.width || "100%" : "100%",
      width: null,
    };

    if (!isOpen) return null;

    return (
      <div
        className={classes}
        style={lineStyle}
        onClick={() => {
          if (lineData?.isHeader) {
            toggleOpenTopic(lineData.topic);
          }
        }}
      >
        <LazyLogLineNumber
          number={number}
          highlight={highlight}
          onClick={onLineNumberClick}
        />
        {Array(lineData.depth)
          .fill()
          .map((_, i) => (
            <span
              key={i}
              className={
                lineData?.isHeader && i === lineData.depth - 1
                  ? isExpanded
                    ? lineDepthHeadExpanded
                    : lineDepthHead
                  : lineDepthBar
              }
            />
          ))}
        <LazyLogLineContent
          number={number}
          onClick={onRowClick}
          formatPart={formatPart}
          data={data}
          content={lineData?.content}
          color={lineData?.color}
        />
        {lineData.isHeader && lineData.time > 0 ? (
          <LineDuration seconds={lineData.time} />
        ) : null}
      </div>
    );
  }
}
