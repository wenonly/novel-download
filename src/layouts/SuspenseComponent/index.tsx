import React, { LazyExoticComponent, Suspense } from 'react';

// eslint-disable-next-line react/display-name
const SuspenseComponent = (Component: LazyExoticComponent<any>, meta: any = {}) => (props: any) => (
  <Suspense fallback={null}>
    <Component meta={meta} {...props} />
  </Suspense>
);

export default SuspenseComponent;
