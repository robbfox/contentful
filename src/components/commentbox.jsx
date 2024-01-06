import React, { useEffect } from 'react';
import commentBox from 'commentbox.io';

const Commentbox = ({ projectId }) => {
  useEffect(() => {
    const removeCommentBox = commentBox(projectId);

    return () => {
      removeCommentBox();
    };
  }, [projectId]);

  return <div className="commentbox" />;
};

export default Commentbox;
