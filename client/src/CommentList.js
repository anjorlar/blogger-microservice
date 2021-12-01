// import React, { useState, useEffect } from "react";
// import axios from "axios";

const CommentList = ({ comments }) => {
  // const [comments, setComments] = useState([]);

  // const fetchData = async () => {
  //   const res = await axios.get(
  //     `http://localhost:4001/posts/${postId}/comments`  ||  await axios.post("http://posts.com/posts", {
  //   );

  //   setComments(res.data);
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const renderedComments = comments.map((comment) => {
    let content;
    // switch (comment.status) {
    //   case 'approved': {
    //     content = comment.content
    //     break;
    //   }
    //   case 'pending': {
    //     content = 'This comment is awaiting moderation'
    //     break;
    //   }
    //   default: {// case 'pending':{
    //     content = 'This comment has been rejected'
    //     break;
    //   }
    // }
    if (comment.status === 'approved') {
      content = comment.content;
    }
    if (comment.status === 'pending') {
      content = 'This comment is awaiting moderation';
    }
    if (comment.status === 'rejected') {
      content = 'This comment has been rejected';
    }
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
