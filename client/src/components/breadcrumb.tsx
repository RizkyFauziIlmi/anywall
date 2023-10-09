import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className='flex gap-2 p-2 text-gray-500 mb-4'>
      <Link to="/" className='hover:text-blue-500'>
        <p className=''>Home</p>
      </Link>
      <span className=''>/</span> {/* Separator */}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <span className=''>{isLast ? name : <Link to={routeTo} className='hover:text-blue-500'>{name}</Link>}</span>
            {!isLast && <span className=''>/</span>} {/* Separator */}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
