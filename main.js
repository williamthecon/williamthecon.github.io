// function getElementsWidth(element) {
//     const style = window.getComputedStyle(element);
//     const width = element.clientWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
//     return width;
// }

// document.addEventListener("DOMContentLoaded", (e) => {
//     const topics = document.querySelectorAll(".topic");
//     let maxTopicMinWidth = parseInt(document.body.style.minWidth);
//     console.log("maxTopicMinWidth: " + maxTopicMinWidth);
//     topics.forEach(topic => {
//         const headerWidth = getElementsWidth(topic.querySelector(".topic-header"));
//         const buttonLinkWidth = getElementsWidth(topic.querySelector(".button-link"));
//         const topicWidth = getElementsWidth(topic);
//         const topicMinWidth = topicWidth - topic.clientWidth + headerWidth + buttonLinkWidth;
//         console.log("topicMinWidth: " + topicMinWidth);
//         if (topicMinWidth > maxTopicMinWidth) {
//             maxTopicMinWidth = topicMinWidth;
//         }
//     });
//     console.log("maxTopicMinWidth: " + maxTopicMinWidth);
//     document.body.style.minWidth = maxTopicMinWidth + "px";
// });

// window.onresize = () => {
//     const topics = document.querySelectorAll(".topic");
//     topics.forEach(topic => {
//         const headerWidth = getElementsWidth(topic.querySelector(".topic-header"));
//         const buttonLinkWidth = getElementsWidth(topic.querySelector(".button-link"));
//         const contentWidth = getElementsWidth(topic.querySelector(".topic-content"));
//         if (headerWidth + buttonLinkWidth > contentWidth) {
//             console.log("headerWidth + buttonLinkWidth > contentWidth");
//             window.resizeBy(headerWidth + buttonLinkWidth - contentWidth, 0);
//         }
//     });
// }
