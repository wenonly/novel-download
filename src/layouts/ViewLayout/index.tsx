import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config';

const ViewLayout: React.FunctionComponent<RouteConfigComponentProps> = (props: RouteConfigComponentProps) => {
  const { route } = props;

  return <>{renderRoutes(route?.routes)}</>;
};

export default ViewLayout;
