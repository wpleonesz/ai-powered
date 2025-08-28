import React, { useState } from 'react';
import Truncate from 'react-truncate';
import renderHTML from 'react-render-html';

const ReadMore = ({ children, more, less, lines = 1 }) => {
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);

  const handleTruncate = (truncated) => {
    if (truncated !== truncated) {
      setTruncated({
        truncated,
      });
    }
  };
  const toggleLines = (event) => {
    event.preventDefault();
    setExpanded({
      expanded: !expanded,
    });
  };
  return (
    <div className="App">
      <div>
        <Truncate
          lines={!expanded && lines}
          ellipsis={
            <span>
              ...{' '}
              <a
                href="#"
                onClick={toggleLines}
                style={{ color: '#B8B2B2', textDecoration: 'none' }}
              >
                <b>{more}</b>
              </a>
            </span>
          }
          onTruncate={handleTruncate}
        >
          {renderHTML(children)}
        </Truncate>
        {!truncated && expanded && (
          <a
            href="#"
            onClick={() => setExpanded(!toggleLines)}
            style={{ color: '#B8B2B2', textDecoration: 'none' }}
          >
            <b>{less}</b>
          </a>
        )}
      </div>
    </div>
  );
};
export default ReadMore;
