import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title,
  children,
  className = '',
  headerClassName = '',
  footerClassName = '',
  footer,
}) => {
  // Only render header if title is provided
  const renderHeader = title ? (
    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
    </div>
  ) : null;

  // Only render footer if footer is provided
  const renderFooter = footer ? (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${footerClassName}`}>
      {footer}
    </div>
  ) : null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded shadow-md border border-gray-200 dark:border-gray-700 ${className}`}>
      {renderHeader}
      <div className="p-4 text-gray-800 dark:text-gray-200">
        {children ? children : (
          <>
            <p>This is a default card content. You can pass <code>children</code> to customize this area.</p>
          </>
        )}
      </div>
      {renderFooter}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  footerClassName: PropTypes.string,
  footer: PropTypes.node,
};

export default Card;
