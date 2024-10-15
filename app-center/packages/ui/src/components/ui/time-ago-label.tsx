import React from "react";
import en from "javascript-time-ago/locale/en";
// @ts-ignore
import TimeAgo from "javascript-time-ago";
// @ts-ignore
import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);

interface TimeAgoLabelProps {
  date: Date;
  className?: string;
}
const TimeAgoLabel = ({ date, className }: TimeAgoLabelProps) => {
  return <ReactTimeAgo date={date} locale="en-US" className={className} />;
};

export default TimeAgoLabel;
