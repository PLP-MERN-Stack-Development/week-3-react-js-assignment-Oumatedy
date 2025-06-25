import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-200 text-gray-600 p-4 text-center">
      &copy; {currentYear} Task Manager. All rights reserved.
    </footer>
  );
};


export default Footer;